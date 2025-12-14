/**
 * MIDI CC mappings for different devices
 * Maps device names to their CC number assignments
 */

export const DEVICE_CC_MAPPINGS: Record<string, Record<string, number>> = {
  // FL Key MIDI controller
  'FLkey Mini MIDI Out': {
    // Master Effects
    master: 21,
    reverb: 22,
    power: 23,
    // Tone Control
    rainbowlize: 24,
    pitch: 25,
    octave: 26,
  },

  // Rainbow Gun physical controller (CC 0-14 for 15 knobs, not in sequential order)
  '4AC0CC15': {
    // Master Effects
    master: 2,
    reverb: 3,
    power: 4,
    // Tone Control
    rainbowlize: 5,
    pitch: 6,
    octave: 7,
    // Sub Bass - ADSR
    attack: 8,
    decay: 9,
    sustain: 0,
    release: 1,
    // Sub Bass - Tone
    subLevel: 12,
    subPower: 13,
    subPunch: 14,
    subFuzz: 10,
    // Gun Output
    gunLevel: 11
  },
};

/**
 * Convert MIDI CC value (0-127) to knob value (0-1)
 */
export function ccValueToKnobValue(ccValue: number): number {
  return Math.max(0, Math.min(1, ccValue / 127));
}

/**
 * Get CC mapping for a device by name
 * Returns null if device not found
 */
export function getDeviceMapping(deviceName: string): Record<string, number> | null {
  return DEVICE_CC_MAPPINGS[deviceName] || null;
}
