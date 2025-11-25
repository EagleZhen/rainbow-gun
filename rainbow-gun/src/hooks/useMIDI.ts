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
  // Track which devices already have listeners attached to prevent duplicates on reconnect
  const attachedDeviceIds = useRef<Set<string>>(new Set());

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
   * List all available MIDI input devices and attach message listeners
   */
  const enumerateMIDIDevices = (access: MIDIAccess) => {
    const devices: MIDIDevice[] = [];
    const inputs = access.inputs.values();

    for (let input of inputs) {
      const deviceName = input.name || `MIDI Device (${input.id})`;

      devices.push({
        id: input.id,
        name: deviceName,
        input,
      });

      // Attach message listener to this device only if not already attached
      // Prevents duplicate listeners on device reconnect
      if (!attachedDeviceIds.current.has(input.id)) {
        attachedDeviceIds.current.add(input.id);

        input.addEventListener('midimessage', (event: Event) => {
          const midiEvent = event as unknown as { data: Uint8Array; timeStamp: number };
          messageListeners.current.forEach(listener => {
            listener({
              data: midiEvent.data,
              timestamp: midiEvent.timeStamp,
              deviceName,
              deviceId: input.id,
            });
          });
        });
      }
    }

    setMidiDevices(devices);
  };

  /**
   * Subscribe to MIDI messages from all devices
   * Returns unsubscribe function
   */
  const onMIDIMessage = useCallback(
    (handler: (event: MIDIMessageEvent) => void) => {
      messageListeners.current.add(handler);

      // Return unsubscribe function
      return () => {
        messageListeners.current.delete(handler);
      };
    },
    []
  );

  return {
    // State
    midiAccess,
    midiDevices,
    error,
    isSupported,

    // Methods
    requestMIDIAccess,
    onMIDIMessage,
  };
}
