import * as Tone from 'tone';
import { guns, getWetSamplePath } from '@/data/guns';
import { AUDIO_ENGINE_DEFAULTS, DEFAULT_KNOB_VALUES } from '@/data/defaults';
import { createPlayerPool, getNextPlayerFromPool, disposePlayerPool } from './player-pool';

/**
 * Sub bass parameters interface for batch updates
 * Ordered to match knobValues state: attack, decay, sustain, release, level, power, punch, fuzz
 */
export interface SubBassParams {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  level: number;
  power: number;
  punch: number;
  fuzz: number;
}

/**
 * AudioEngine: Tone.js engine for dry gun + wet sample crossfading + sub bass synthesis
 */
export class AudioEngine {
  private initialized = false;
  private readonly POLYPHONY = 6; // Max simultaneous sounds per gun

  // Dry gun sounds: pool of players to allow polyphonic playback
  private dryGunPlayers: Record<string, Tone.Player[]> = {};
  private dryGunPlayerIndices: Record<string, number> = {}; // Track which player to use next

  // Wet samples: gun ID → pitch index → chord type → player pool
  private wetSamplePlayers: Record<string, Record<number, Record<string, Tone.Player[]>>> = {};
  private wetSampleIndices: Record<string, Record<number, Record<string, number>>> = {};

  // Wet/dry crossfade nodes (gun channel)
  private dryGain: Tone.Gain;
  private wetGain: Tone.Gain;

  // Sub bass synthesis nodes
  // Sine path
  private sineOsc: Tone.Oscillator;
  private subLevel: Tone.Gain; // Sine amplitude control
  private subPunch: Tone.Gain; // TODO: pitch drop effect
  // Noise path
  private noiseOsc: Tone.Oscillator; // White noise source
  private subFuzz: Tone.Gain; // Noise amplitude control
  // Mixing and processing
  private subMixer: Tone.Gain; // Mixes sine + noise
  private subPower: Tone.Gain; // TODO: distortion effect
  private subEnvelope: Tone.Envelope; // ADSR envelope
  private subGain: Tone.Gain; // Master sub bass output

  constructor() {
    // Create wet/dry gain nodes
    this.dryGain = new Tone.Gain(1); // Start at full dry
    this.wetGain = new Tone.Gain(0); // Start at zero wet
    this.dryGain.connect(Tone.getDestination());
    this.wetGain.connect(Tone.getDestination());

    // Load dry gun sounds (create a pool of players for polyphony)
    guns.forEach(gun => {
      this.dryGunPlayers[gun.id] = createPlayerPool(gun.soundUrl, this.dryGain, this.POLYPHONY);
      this.dryGunPlayerIndices[gun.id] = 0;
    });

    // Initialize wet sample players (scout only for now)
    guns.forEach(gun => {
      this.wetSamplePlayers[gun.id] = {};
      this.wetSampleIndices[gun.id] = {};
      // TODO: Add wet samples for other guns
      if (gun.id !== 'scout') return;

      for (let pitchIndex = 0; pitchIndex < 12; pitchIndex++) {
        const majorPath = getWetSamplePath(gun.wetSampleDir, pitchIndex, 'major');
        const minorPath = getWetSamplePath(gun.wetSampleDir, pitchIndex, 'minor');
        console.log(`[AudioEngine] Loading ${gun.id} pitch ${pitchIndex}: major="${majorPath}" minor="${minorPath}"`);

        this.wetSamplePlayers[gun.id][pitchIndex] = {};
        this.wetSampleIndices[gun.id][pitchIndex] = {};

        // Create player pools for both major and minor
        this.wetSamplePlayers[gun.id][pitchIndex].major = createPlayerPool(majorPath, this.wetGain, this.POLYPHONY);
        this.wetSampleIndices[gun.id][pitchIndex].major = 0;

        this.wetSamplePlayers[gun.id][pitchIndex].minor = createPlayerPool(minorPath, this.wetGain, this.POLYPHONY);
        this.wetSampleIndices[gun.id][pitchIndex].minor = 0;
      }
    });

    // Initialize sub bass synthesis chain with defaults
    const subBassDefaults = DEFAULT_KNOB_VALUES;
    const audioDefaults = AUDIO_ENGINE_DEFAULTS.subBass;
    const adsrDefaults = audioDefaults.adsr;

    // Sine oscillator path
    this.sineOsc = new Tone.Oscillator(audioDefaults.frequency, audioDefaults.waveform);
    this.subLevel = new Tone.Gain(subBassDefaults.subLevel);
    this.subPunch = new Tone.Gain(1); // TODO: pitch drop effect (placeholder)

    // White noise path
    this.noiseOsc = new Tone.Oscillator(audioDefaults.frequency, 'square');
    this.subFuzz = new Tone.Gain(subBassDefaults.subFuzz);

    // Mixing and final processing
    this.subMixer = new Tone.Gain(1);
    this.subPower = new Tone.Gain(subBassDefaults.subPower);

    // ADSR and output
    this.subEnvelope = new Tone.Envelope({
      attack: subBassDefaults.attack * adsrDefaults.attackScale,
      decay: subBassDefaults.decay * adsrDefaults.decayScale,
      sustain: subBassDefaults.sustain * adsrDefaults.sustainScale,
      release: subBassDefaults.release * adsrDefaults.releaseScale,
    });
    this.subGain = new Tone.Gain(audioDefaults.masterGain);

    // Wire sub bass chain:
    // Sine path: sineOsc → subLevel → subPunch ─┐
    //                                            ├→ subMixer → subPower → subEnvelope → subGain → output
    // Noise path: noiseOsc → subFuzz ───────────┘
    this.sineOsc.connect(this.subLevel);
    this.subLevel.connect(this.subPunch);
    this.subPunch.connect(this.subMixer);

    this.noiseOsc.connect(this.subFuzz);
    this.subFuzz.connect(this.subMixer);

    this.subMixer.connect(this.subPower);
    this.subPower.connect(this.subEnvelope);
    this.subEnvelope.connect(this.subGain);
    this.subGain.connect(Tone.getDestination());

    // Start oscillators (always running, gated by envelope)
    this.sineOsc.start();
    this.noiseOsc.start();
  }

  /**
   * Initialize Tone.js context (must call on first user interaction)
   */
  async init(): Promise<void> {
    if (this.initialized) return;
    await Tone.start();
    this.initialized = true;
  }

  /**
   * Play a dry gun sound by ID (uses player pool for polyphonic playback)
   */
  playGun(gunId: string): void {
    if (!this.initialized) {
      console.warn('AudioEngine not initialized. Call init() first.');
      return;
    }

    const playerPool = this.dryGunPlayers[gunId];
    if (!playerPool || playerPool.length === 0) {
      console.warn(`Gun not found: ${gunId}`);
      return;
    }

    const player = getNextPlayerFromPool(playerPool, this.dryGunPlayerIndices, gunId, this.POLYPHONY);
    player.start();
  }

  /**
   * Play a wet sample by gun ID, pitch index, and chord type (uses player pool)
   */
  playWetGun(gunId: string, pitchIndex: number, chordType: 'major' | 'minor'): void {
    if (!this.initialized) {
      console.warn('AudioEngine not initialized. Call init() first.');
      return;
    }

    const wetPlayers = this.wetSamplePlayers[gunId];
    if (!wetPlayers) {
      console.warn(`Gun not found: ${gunId}`);
      return;
    }

    const pitchPlayers = wetPlayers[pitchIndex];
    if (!pitchPlayers) {
      console.warn(`Pitch index out of range: ${pitchIndex}`);
      return;
    }

    const playerPool = pitchPlayers[chordType];
    if (!playerPool || !Array.isArray(playerPool)) {
      console.warn(`Chord type not found: ${chordType}`);
      return;
    }

    const player = getNextPlayerFromPool(
      playerPool,
      this.wetSampleIndices[gunId][pitchIndex],
      chordType,
      this.POLYPHONY
    );

    console.log(`Playing wet sample: ${gunId} pitch ${pitchIndex} ${chordType}, loaded: ${player.loaded}`);
    player.start();
  }

  /**
   * Set wet/dry crossfade amount (0 = dry, 1 = wet)
   */
  setCrossfadeAmount(amount: number): void {
    this.dryGain.gain.value = 1 - amount;
    this.wetGain.gain.value = amount;
  }

  /**
   * Cleanup all resources
   */
  dispose(): void {
    // Cleanup dry gun player pools
    Object.values(this.dryGunPlayers).forEach(playerPool => {
      disposePlayerPool(playerPool);
    });
    this.dryGunPlayers = {};

    // Cleanup wet sample player pools
    Object.values(this.wetSamplePlayers).forEach(pitchMap => {
      Object.values(pitchMap).forEach(chordMap => {
        Object.values(chordMap).forEach(playerPool => {
          if (Array.isArray(playerPool)) {
            disposePlayerPool(playerPool);
          }
        });
      });
    });
    this.wetSamplePlayers = {};

    // Cleanup gain nodes (gun channel)
    this.dryGain.dispose();
    this.wetGain.dispose();

    // Cleanup sub bass synthesis nodes
    this.sineOsc.dispose();
    this.noiseOsc.dispose();
    this.subLevel.dispose();
    this.subPunch.dispose();
    this.subFuzz.dispose();
    this.subMixer.dispose();
    this.subPower.dispose();
    this.subEnvelope.dispose();
    this.subGain.dispose();

    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Trigger sub bass envelope (attack/decay/sustain/release)
   */
  fireSubBass(): void {
    if (!this.initialized) {
      console.warn('AudioEngine not initialized. Call init() first.');
      return;
    }
    this.subEnvelope.triggerAttack();
  }

  /**
   * Update sub bass parameters (batch update with ADSR time scaling)
   */
  setSubParameters(params: SubBassParams): void {
    const adsrDefaults = AUDIO_ENGINE_DEFAULTS.subBass.adsr;

    this.subEnvelope.attack = params.attack * adsrDefaults.attackScale;
    this.subEnvelope.decay = params.decay * adsrDefaults.decayScale;
    this.subEnvelope.sustain = params.sustain * adsrDefaults.sustainScale;
    this.subEnvelope.release = params.release * adsrDefaults.releaseScale;

    this.subLevel.gain.value = params.level;
    this.subPower.gain.value = params.power;
    this.subPunch.gain.value = params.punch;
    this.subFuzz.gain.value = params.fuzz;
  }
}
