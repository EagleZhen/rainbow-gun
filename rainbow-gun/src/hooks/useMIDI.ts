'use client';

import { useState, useCallback, useRef } from 'react';
import { MIDIDevice, MIDIMessageEvent } from '@/types/midi';

/**
 * Hook for accessing Web MIDI API
 * Handles MIDI device enumeration and message listening
 * Listens to ALL connected devices simultaneously
 */
export function useMIDI() {
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  const [midiDevices, setMidiDevices] = useState<MIDIDevice[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Message listeners registry
  const messageListeners = useRef<Set<(event: MIDIMessageEvent) => void>>(new Set());

  /**
   * Request MIDI access from the browser (shows permission dialog)
   */
  const requestMIDIAccess = useCallback(async () => {
    try {
      // Check if Web MIDI API is available
      if (!navigator.requestMIDIAccess) {
        setIsSupported(false);
        setError('Web MIDI API is not supported in this browser');
        return;
      }

      const access = await navigator.requestMIDIAccess();
      setMidiAccess(access);
      setError(null);

      // Enumerate devices
      enumerateMIDIDevices(access);

      // Listen for device changes (connect/disconnect)
      access.addEventListener('statechange', () => {
        enumerateMIDIDevices(access);
      });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to request MIDI access';
      setError(errorMsg);
      console.error('MIDI access error:', errorMsg);
    }
  }, []);

  /**
   * List all available MIDI input devices
   */
  const enumerateMIDIDevices = (access: MIDIAccess) => {
    const devices: MIDIDevice[] = [];
    const inputs = access.inputs.values();

    for (let input of inputs) {
      devices.push({
        id: input.id,
        name: input.name || `MIDI Device (${input.id})`,
        input,
      });
    }

    setMidiDevices(devices);
  };

  return {
    // State
    midiAccess,
    midiDevices,
    error,
    isSupported,

    // Methods
    requestMIDIAccess,
  };
}
