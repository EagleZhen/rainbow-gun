// Note names and their MIDI note numbers
export const NOTE_NAMES = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'] as const;

export type NoteName = typeof NOTE_NAMES[number];

// Map from index (1-12) to note name
export const INDEX_TO_NOTE: Record<number, NoteName> = {
  1: 'c',
  2: 'c#',
  3: 'd',
  4: 'd#',
  5: 'e',
  6: 'f',
  7: 'f#',
  8: 'g',
  9: 'g#',
  10: 'a',
  11: 'a#',
  12: 'b',
};

// Map from note name to index (1-12)
export const NOTE_TO_INDEX: Record<NoteName, number> = {
  'c': 1,
  'c#': 2,
  'd': 3,
  'd#': 4,
  'e': 5,
  'f': 6,
  'f#': 7,
  'g': 8,
  'g#': 9,
  'a': 10,
  'a#': 11,
  'b': 12,
};

/**
 * Convert pitch index (0-11 = C-B in octave 1, 12-23 = C-B in octave 2, etc.)
 * to MIDI note number (C1 = 12, A4 = 69, etc.)
 */
export function pitchIndexToMidiNote(pitchIndex: number): number {
  const noteInOctave = ((pitchIndex % 12) + 12) % 12; // 0-11
  const octave = Math.floor(pitchIndex / 12) + 1; // 1-based octave
  return octave * 12 + noteInOctave;
}

/**
 * Convert MIDI note number to frequency in Hz
 * Formula: f = 440 * 2^((n - 69) / 12)
 */
export function midiNoteToFrequency(midiNote: number): number {
  return 440 * Math.pow(2, (midiNote - 69) / 12);
}

/**
 * Convert pitch index to frequency
 */
export function pitchIndexToFrequency(pitchIndex: number): number {
  const midiNote = pitchIndexToMidiNote(pitchIndex);
  return midiNoteToFrequency(midiNote);
}

/**
 * Convert pitch index (0-11) to note name
 */
export function pitchIndexToNote(pitchIndex: number): NoteName {
  const noteIndex = ((pitchIndex % 12) + 12) % 12;
  return NOTE_NAMES[noteIndex];
}

/**
 * Get file index (1-12) from pitch index
 * Always wraps to 1-12 regardless of octave
 */
export function pitchIndexToFileIndex(pitchIndex: number): number {
  const noteIndex = ((pitchIndex % 12) + 12) % 12;
  return noteIndex + 1; // Convert 0-11 to 1-12
}
