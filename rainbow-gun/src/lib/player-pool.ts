import * as Tone from 'tone';

/**
 * Create a pool of identical Tone.js Players
 * Useful for polyphonic playback where multiple instances of the same sound can play simultaneously
 */
export function createPlayerPool(
  url: string,
  destination: Tone.Gain,
  polyphony: number
): Tone.Player[] {
  const pool: Tone.Player[] = [];
  for (let i = 0; i < polyphony; i++) {
    pool.push(
      new Tone.Player({ url, loop: false }).connect(destination)
    );
  }
  return pool;
}

/**
 * Get the next player from a pool and advance the index
 * Cycles through the pool in a round-robin fashion
 */
export function getNextPlayerFromPool(
  pool: Tone.Player[],
  indices: Record<string, number>,
  key: string,
  polyphony: number
): Tone.Player {
  const index = indices[key];
  const player = pool[index];
  indices[key] = (index + 1) % polyphony;
  return player;
}

/**
 * Dispose all players in a pool
 */
export function disposePlayerPool(pool: Tone.Player[]): void {
  pool.forEach(player => {
    player.stop();
    player.dispose();
  });
}
