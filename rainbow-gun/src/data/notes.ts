// Pitch system constants
export const PITCH_COUNT = 12; // 12 chromatic notes
export const PITCH_STEP = 1 / 11; // 12 pitches = 11 intervals between them
export const DEFAULT_PITCH_INDEX = 0; // F# (6th pitch in chromatic scale)
export const DEFAULT_PITCH = DEFAULT_PITCH_INDEX * PITCH_STEP; // Calculate from pitch index

// 12 chromatic notes (pitch indices 0-11 map to these)
export const NOTE_NAMES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'] as const;

export type NoteName = typeof NOTE_NAMES[number];

/**
 * Convert pitch index (0-11) to note name
 * Pitch index always wraps to 0-11 (12 chromatic notes)
 * Octaves are controlled via Tone.js pitch shifting, not file selection
 */
export function pitchIndexToNote(pitchIndex: number): NoteName {
  const noteIndex = ((pitchIndex % 12) + 12) % 12;
  return NOTE_NAMES[noteIndex];
}

/**
 * Get file index (1-12) from pitch index for wet sample file paths
 * Maps pitch indices to filenames: 1 c maj.wav, 2 c# maj.wav, etc.
 */
export function pitchIndexToFileIndex(pitchIndex: number): number {
  const noteIndex = ((pitchIndex % 12) + 12) % 12;
  return noteIndex + 1; // Convert 0-11 to 1-12
}

/**
 * Convert normalized knob value (0-1) to pitch index (0-11)
 */
export function knobValueToPitchIndex(knobValue: number): number {
  return Math.round(knobValue * 11);
}
