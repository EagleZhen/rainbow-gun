import * as Tone from 'tone';
import { guns, getWetSamplePath } from '@/data/guns';

/**
 * AudioEngine: Tone.js engine for dry gun + wet sample crossfading
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

  // Wet/dry crossfade nodes
  private dryGain: Tone.Gain;
  private wetGain: Tone.Gain;

  constructor() {
    // Create wet/dry gain nodes
    this.dryGain = new Tone.Gain(1); // Start at full dry
    this.wetGain = new Tone.Gain(0); // Start at zero wet
    this.dryGain.connect(Tone.getDestination());
    this.wetGain.connect(Tone.getDestination());

    // Load dry gun sounds (create a pool of players for polyphony)
    guns.forEach(gun => {
      this.dryGunPlayers[gun.id] = [];
      this.dryGunPlayerIndices[gun.id] = 0;
      for (let i = 0; i < this.POLYPHONY; i++) {
        this.dryGunPlayers[gun.id].push(
          new Tone.Player({
            url: gun.soundUrl,
            loop: false,
          }).connect(this.dryGain)
        );
      }
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
        this.wetSamplePlayers[gun.id][pitchIndex].major = [];
        this.wetSampleIndices[gun.id][pitchIndex].major = 0;
        for (let i = 0; i < this.POLYPHONY; i++) {
          this.wetSamplePlayers[gun.id][pitchIndex].major.push(
            new Tone.Player({
              url: majorPath,
              loop: false,
            }).connect(this.wetGain)
          );
        }

        this.wetSamplePlayers[gun.id][pitchIndex].minor = [];
        this.wetSampleIndices[gun.id][pitchIndex].minor = 0;
        for (let i = 0; i < this.POLYPHONY; i++) {
          this.wetSamplePlayers[gun.id][pitchIndex].minor.push(
            new Tone.Player({
              url: minorPath,
              loop: false,
            }).connect(this.wetGain)
          );
        }
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

    // Cycle through the player pool
    const index = this.dryGunPlayerIndices[gunId];
    const player = playerPool[index];
    this.dryGunPlayerIndices[gunId] = (index + 1) % this.POLYPHONY;

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

    // Cycle through the player pool
    const index = this.wetSampleIndices[gunId][pitchIndex][chordType];
    const player = playerPool[index];
    this.wetSampleIndices[gunId][pitchIndex][chordType] = (index + 1) % this.POLYPHONY;

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
      playerPool.forEach(player => {
        player.stop();
        player.dispose();
      });
    });
    this.dryGunPlayers = {};

    // Cleanup wet sample player pools
    Object.values(this.wetSamplePlayers).forEach(pitchMap => {
      Object.values(pitchMap).forEach(chordMap => {
        Object.values(chordMap).forEach(playerPool => {
          if (Array.isArray(playerPool)) {
            playerPool.forEach(player => {
              player.stop();
              player.dispose();
            });
          }
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
