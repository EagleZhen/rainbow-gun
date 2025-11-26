'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import GunSelector from '@/components/GunSelector';
import ChordSelector from '@/components/ChordSelector';
import SubBassPanel from '@/components/SubBassPanel';
import EffectsPanel from '@/components/EffectsPanel';
import TriggerPanel from '@/components/TriggerPanel';
import DebugPanel from '@/components/DebugPanel';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { useMIDI } from '@/hooks/useMIDI';
import { knobValueToPitchIndex, PITCH_STEP, DEFAULT_PITCH } from '@/data/notes';
import { guns } from '@/data/guns';
import { getDeviceMapping, ccValueToKnobValue } from '@/data/midiMappings';
import { DEFAULT_KNOB_VALUES } from '@/data/defaults';

export default function Home() {
  const { engine, initEngine } = useAudioEngine();
  const { isSupported, midiAccess, midiDevices, error, requestMIDIAccess, onMIDIMessage } = useMIDI();
  const [selectedKnob, setSelectedKnob] = useState<string | null>(null);
  const [selectedChord, setSelectedChord] = useState<'major' | 'minor'>('major');
  const [selectedGunIds, setSelectedGunIds] = useState<Set<string>>(new Set());
  const [activeGunId, setActiveGunId] = useState<string>('scout'); // Persistent gun selection
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const [knobValues, setKnobValues] = useState(DEFAULT_KNOB_VALUES);

  const handleKnobSelect = (knobId: string) => {
    setSelectedKnob(prev => prev === knobId ? null : knobId);
  };

  const KNOB_ADJUSTMENT_STEP = 0.02; // 2% adjustment per keypress
  const clampValue = (value: number) => Math.max(0, Math.min(1, value));

  // Fire trigger: play audio + show visual feedback
  const fireGun = useCallback(async (gunId: string) => {
    // Set as active gun (persistent selection)
    setActiveGunId(gunId);

    // Show temporary visual feedback: highlight the gun button
    setSelectedGunIds(prev => new Set(prev).add(gunId));

    // Clear any existing timeout for this gun
    if (timeoutRefs.current[gunId]) {
      clearTimeout(timeoutRefs.current[gunId]);
    }

    // Auto-deselect from selectedGunIds after 1 second (but activeGunId persists)
    timeoutRefs.current[gunId] = setTimeout(() => {
      setSelectedGunIds(prev => {
        const next = new Set(prev);
        next.delete(gunId);
        return next;
      });
      delete timeoutRefs.current[gunId];
    }, 1000);

    if (!engine) return;

    // Initialize audio context on first interaction
    await initEngine();

    // Play both dry and wet sounds with the fired gun
    engine.playGun(gunId);
    engine.playWetGun(gunId, knobValueToPitchIndex(knobValues.pitch), selectedChord);
  }, [engine, initEngine, knobValues.pitch, selectedChord]);

  // Wire rainbowlize knob to AudioEngine crossfade
  useEffect(() => {
    if (engine) {
      engine.setCrossfadeAmount(knobValues.rainbowlize);
    }
  }, [engine, knobValues.rainbowlize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle arrow keys for knob adjustment (only if a knob is selected)
      if (selectedKnob && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        const step = selectedKnob === 'pitch' ? PITCH_STEP : KNOB_ADJUSTMENT_STEP;
        const delta = e.key === 'ArrowUp' ? step : -step;
        e.preventDefault();
        setKnobValues(prev => {
          const currentValue = prev[selectedKnob as keyof typeof prev];
          return {
            ...prev,
            [selectedKnob]: clampValue(currentValue + delta)
          };
        });
        return;
      }

      // Handle number keys 1 & 2 (rainbow gun trigger keys) to fire the currently active gun
      if (e.key === '1' || e.key === '2') {
        fireGun(activeGunId);
        return;
      }

      // Handle Q/W/E keys for gun selection/firing
      // Remapped from 1/2/3 to avoid conflict with the default key on the rainbow gun
      const gunKeyMap: Record<string, number> = { 'q': 0, 'w': 1, 'e': 2 };
      const gunIndex = gunKeyMap[e.key.toLowerCase()];
      if (gunIndex !== undefined && gunIndex < guns.length) {
        fireGun(guns[gunIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedKnob, fireGun, activeGunId]);

  // Request MIDI access on page load
  useEffect(() => {
    requestMIDIAccess();
  }, [requestMIDIAccess]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, []);

  // Subscribe to MIDI messages and log them to console for testing
  useEffect(() => {
    const unsubscribe = onMIDIMessage((event) => {
      const byte0 = event.data[0];

      // Skip system real-time messages (0xF8 = Timing Clock, etc.)
      if (byte0 >= 0xf8) {
        return;
      }

      const status = byte0 & 0xf0;
      const data1 = event.data[1];
      const data2 = event.data[2];

      let messageType = '';
      if (status === 0xb0) {
        messageType = `CC ${data1} = ${data2}`;
      } else if (status === 0x90) {
        messageType = `Note On ${data1} (velocity: ${data2})`;
      } else if (status === 0x80) {
        messageType = `Note Off ${data1}`;
      } else {
        messageType = `Unknown [${byte0}, ${data1}, ${data2}]`;
      }

      console.log(`[MIDI] ${event.deviceName}: ${messageType}`);
    });

    return unsubscribe;
  }, [onMIDIMessage]);

  // Handle MIDI CC messages to control knobs
  useEffect(() => {
    const unsubscribe = onMIDIMessage((event) => {
      const byte0 = event.data[0];
      const status = byte0 & 0xf0;

      // Only process CC (Control Change) messages
      if (status !== 0xb0) {
        return;
      }

      const ccNumber = event.data[1];
      const ccValue = event.data[2];

      // Get mapping for this device
      const mapping = getDeviceMapping(event.deviceName);
      if (!mapping) {
        return;
      }

      // Find which knob this CC number maps to
      const knobId = Object.entries(mapping).find(([, cc]) => cc === ccNumber)?.[0];
      if (!knobId) {
        return;
      }

      // Convert CC value (0-127) to knob value (0-1)
      const knobValue = ccValueToKnobValue(ccValue);

      // Update knobValues state
      setKnobValues(prev => ({
        ...prev,
        [knobId]: knobValue,
      }));

      // Show visual feedback by selecting the knob
      setSelectedKnob(knobId);

      // Clear any existing timeout for this knob
      if (timeoutRefs.current[knobId]) {
        clearTimeout(timeoutRefs.current[knobId]);
      }

      // Auto-clear selection after a brief period
      timeoutRefs.current[knobId] = setTimeout(() => {
        setSelectedKnob(null);
        delete timeoutRefs.current[knobId];
      }, 500);
    });

    return unsubscribe;
  }, [onMIDIMessage]);

  // Build debug items from MIDI state
  const debugItems = [
    { label: 'MIDI Supported', value: isSupported ? 'Yes' : 'No' },
    { label: 'MIDI Access', value: midiAccess ? 'Granted' : 'Not Granted' },
    { label: 'Devices', value: String(midiDevices.length) },
    ...(midiDevices.length > 0 ? [{
      label: 'Device Names',
      value: midiDevices.map(d => d.name).join(', ')
    }] : []),
    ...(error ? [{ label: 'MIDI Error', value: error }] : []),
  ];

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">The Rainbow Gun</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL - Gun Selection & Sub Bass */}
          <div className="space-y-6">
            <GunSelector selectedGunIds={selectedGunIds} activeGunId={activeGunId} onFire={fireGun} />
            <ChordSelector selectedChord={selectedChord} onSelectChord={setSelectedChord} />
            <SubBassPanel
              knobValues={knobValues}
              selectedKnob={selectedKnob}
              onKnobSelect={handleKnobSelect}
            />
          </div>

          {/* RIGHT PANEL - Effects & Trigger */}
          <div className="space-y-6">
            <EffectsPanel
              knobValues={knobValues}
              selectedKnob={selectedKnob}
              onKnobSelect={handleKnobSelect}
            />
            <TriggerPanel
              knobValues={knobValues}
              selectedKnob={selectedKnob}
              onKnobSelect={handleKnobSelect}
            />
          </div>
        </div>

        {/* Debug Panel */}
        <DebugPanel items={debugItems} onRequestMIDI={requestMIDIAccess} />
      </div>
    </div>
  );
}
