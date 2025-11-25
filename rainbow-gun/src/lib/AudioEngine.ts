import * as Tone from 'tone';
import { guns, getWetSamplePath } from '@/data/guns';

/**
 * AudioEngine: Tone.js engine for dry gun + wet sample crossfading
 */
export class AudioEngine {
  private initialized = false;

  // Dry gun sounds
  private dryGunPlayers: Record<string, Tone.Player> = {};

  // Wet samples: gun ID → pitch index → chord type → player
  private wetSamplePlayers: Record<string, Record<number, Record<string, Tone.Player>>> = {};

  // Wet/dry crossfade nodes
  private dryGain: Tone.Gain;
  private wetGain: Tone.Gain;

  constructor() {
    // Create wet/dry gain nodes
    this.dryGain = new Tone.Gain(1); // Start at full dry
    this.wetGain = new Tone.Gain(0); // Start at zero wet
    this.dryGain.connect(Tone.getDestination());
    this.wetGain.connect(Tone.getDestination());

    // Load dry gun sounds
    guns.forEach(gun => {
      this.dryGunPlayers[gun.id] = new Tone.Player({
        url: gun.soundUrl,
        loop: false,
        fadeOut: 0.1,
      }).connect(this.dryGain);
    });

    // Initialize wet sample players structure (don't load yet, just set up structure)
    guns.forEach(gun => {
      this.wetSamplePlayers[gun.id] = {};
      for (let pitchIndex = 0; pitchIndex < 12; pitchIndex++) {
        const majorPath = getWetSamplePath(gun.wetSampleDir, pitchIndex, 'major');
        const minorPath = getWetSamplePath(gun.wetSampleDir, pitchIndex, 'minor');
        console.log(`[AudioEngine] Loading ${gun.id} pitch ${pitchIndex}: major="${majorPath}" minor="${minorPath}"`);
        this.wetSamplePlayers[gun.id][pitchIndex] = {
          major: new Tone.Player({
            url: majorPath,
            loop: false,
            fadeOut: 0.1,
          }).connect(this.wetGain),
          minor: new Tone.Player({
            url: minorPath,
            loop: false,
            fadeOut: 0.1,
          }).connect(this.wetGain),
        };
      }
    });
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
   * Play a dry gun sound by ID
   */
  playGun(gunId: string): void {
    if (!this.initialized) {
      console.warn('AudioEngine not initialized. Call init() first.');
      return;
    }

    const player = this.dryGunPlayers[gunId];
    if (!player) {
      console.warn(`Gun not found: ${gunId}`);
      return;
    }

    player.stop();
    player.start();
  }

  /**
   * Play a wet sample by gun ID, pitch index, and chord type
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

    const player = pitchPlayers[chordType];
    if (!player) {
      console.warn(`Chord type not found: ${chordType}`);
      return;
    }

    console.log(`Playing wet sample: ${gunId} pitch ${pitchIndex} ${chordType}, loaded: ${player.loaded}`);
    player.stop();
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
    // Cleanup dry gun players
    Object.values(this.dryGunPlayers).forEach(player => {
      player.stop();
      player.dispose();
    });
    this.dryGunPlayers = {};

    // Cleanup wet sample players
    Object.values(this.wetSamplePlayers).forEach(pitchMap => {
      Object.values(pitchMap).forEach(chordMap => {
        Object.values(chordMap).forEach(player => {
          player.stop();
          player.dispose();
        });
      });
    });
    this.wetSamplePlayers = {};

    // Cleanup gain nodes
    this.dryGain.dispose();
    this.wetGain.dispose();

    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
