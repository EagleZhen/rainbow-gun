/**
 * MIDI Types and Interfaces
 * Handles Web MIDI API integration and device/controller mapping
 */

/**
 * Mapping of knob IDs to MIDI CC numbers for a specific device
 * Example: { pitch: 20, rainbowlize: 21, drySub: 22, ... }
 */
export type KnobToCCMapping = Record<string, number>;

/**
 * MIDI mappings for a specific device (by name)
 * Stores which CC numbers correspond to which knobs
 */
export interface DeviceMapping {
  knobMappings: KnobToCCMapping;
  timestamp: number; // When this mapping was last updated
}

/**
 * Root MIDI configuration stored in localStorage
 * Structure: { "deviceName": { knobMappings: {...}, timestamp: ... }, ... }
 */
export type MIDIMappings = Record<string, DeviceMapping>;

/**
 * Current learn mode state
 * When a user right-clicks a knob to learn its CC mapping
 */
export interface LearnModeState {
  isLearning: boolean;
  knobId: string | null; // Which knob is waiting for CC input
  deviceName: string | null; // Which device we're learning from
}

/**
 * MIDI device information
 */
export interface MIDIDevice {
  id: string;
  name: string;
  input?: MIDIInput;
}

/**
 * MIDI message event with device context
 * Includes the raw MIDI data plus info about which device sent it
 */
export interface MIDIMessageEvent {
  data: Uint8Array; // [status, data1, data2]
  timestamp: number;
  deviceName: string;
  deviceId: string;
}
