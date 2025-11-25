/**
 * MIDI CC mappings for different devices
 * Maps device names to their CC number assignments
 */

export const DEVICE_CC_MAPPINGS: Record<string, Record<string, number>> = {
  // FL Key MIDI controller
  'FLkey Mini MIDI Out': {
    pitch: 21,
    rainbowlize: 22
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
