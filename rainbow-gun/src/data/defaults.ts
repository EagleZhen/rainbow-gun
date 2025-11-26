/**
 * Default values for all app parameters
 * Central source of truth for initial state across components and audio engine
 */

import { DEFAULT_PITCH } from './notes';

export const DEFAULT_CHORD = 'minor' as const;

export const DEFAULT_KNOB_VALUES = {
  // Master Effects
  master: 0.8,
  reverb: 0,
  power: 0,
  // Tone Control
  rainbowlize: 0,
  pitch: DEFAULT_PITCH,
  octave: 0.5,
  // Sub Bass - ADSR
  attack: 0.05,
  decay: 0.52,
  sustain: 0.5,
  release: 0.25,
  // Sub Bass - Tone
  subLevel: 0.3,
  subPower: 0.5,
  subPunch: 1,
  subFuzz: 0.3,
  // Trigger
  fireRate: 0.5,
  // Gun Output
  gunLevel: 0.8,
} as const;

/**
 * Audio synthesis engine defaults
 */
export const AUDIO_ENGINE_DEFAULTS = {
  subBass: {
    frequency: 46, // Hz (default frequency for sine oscillator)
    waveform: 'sine' as const,
    masterGain: 1, // Overall sub bass output volume
    // ADSR time scaling factors (knob 0-1 range → seconds)
    adsr: {
      attackScale: 1,    // 0-1s (fast transient)
      decayScale: 2,     // 0-2s (tone shaping)
      sustainScale: 1,   // 0-1 gain (no time scaling)
      releaseScale: 2,   // 0-2s (tail length)
    },
  },
} as const;
