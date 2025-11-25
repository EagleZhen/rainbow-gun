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

