import * as Tone from 'tone';
import { guns } from '@/data/guns';

/**
 * AudioEngine: Minimal Tone.js audio engine
 */
export class AudioEngine {
  private initialized = false;
  private gunPlayers: Record<string, Tone.Player> = {};

  constructor() {
    // Load each gun sound into a Tone.Player
    guns.forEach(gun => {
      this.gunPlayers[gun.id] = new Tone.Player({
        url: gun.soundUrl,
        loop: false,
        fadeOut: 0.1,
      }).connect(Tone.Destination);
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
    this.initialized = false;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
