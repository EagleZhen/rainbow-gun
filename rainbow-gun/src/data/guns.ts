import { pitchIndexToFileIndex, pitchIndexToNote } from '@/data/notes';

export interface Gun {
  id: string;
  name: string;
  soundUrl: string;      // dry gun sample
  imageUrl: string;
  wetSampleDir: string;  // directory containing wet samples (e.g., '/guns/scout')
}

/**
 * Build wet sample file path
 * Format: {wetSampleDir}/{fileIndex} {noteName} {chordType}.wav
 * Example: /guns/scout/1%20c%23%20maj.wav
 */
export function getWetSamplePath(
  wetSampleDir: string,
  pitchIndex: number,
  chordType: 'major' | 'minor'
): string {
  const fileIndex = pitchIndexToFileIndex(pitchIndex);
  const noteName = pitchIndexToNote(pitchIndex);
  const suffix = chordType === 'major' ? 'maj' : 'min';
  const fileName = `${fileIndex} ${noteName} ${suffix}.wav`;
  return `${wetSampleDir}/${encodeURIComponent(fileName)}`;
}

export const guns: Gun[] = [
  {
    id: 'scout',
    name: 'Scout',
    soundUrl: '/guns/scout.mp3',
    imageUrl: '/guns/scout.png',
    wetSampleDir: '/guns/scout',
  },
  {
    id: 'ak-47',
    name: 'AK-47',
    soundUrl: '/guns/ak-47.mp3',
    imageUrl: '/guns/ak-47.png',
    wetSampleDir: '/guns/ak-47',
  },
  {
    id: 'desert-eagle',
    name: 'Desert Eagle',
    soundUrl: '/guns/desert-eagle.mp3',
    imageUrl: '/guns/desert-eagle.png',
    wetSampleDir: '/guns/desert-eagle',
  },
];
