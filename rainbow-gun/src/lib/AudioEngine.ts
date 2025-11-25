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
  private crossfadeAmount = 0; // 0 = 100% dry, 1 = 100% wet

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
        this.wetSamplePlayers[gun.id][pitchIndex] = {
          major: new Tone.Player({
            url: getWetSamplePath(gun.wetSampleDir, pitchIndex, 'major'),
            loop: false,
            fadeOut: 0.1,
          }).connect(this.wetGain),
          minor: new Tone.Player({
            url: getWetSamplePath(gun.wetSampleDir, pitchIndex, 'minor'),
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
   * Play a gun sound by ID
   */
  playGun(gunId: string): void {
    if (!this.initialized) {
      console.warn('AudioEngine not initialized. Call init() first.');
      return;
    }

    const player = this.gunPlayers[gunId];
    if (!player) {
      console.warn(`Gun not found: ${gunId}`);
      return;
    }

    player.stop();
    player.start();
  }

  /**
   * Cleanup
   */
  dispose(): void {
    Object.values(this.gunPlayers).forEach(player => {
      player.stop();
      player.dispose();
    });
    this.gunPlayers = {};
    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
