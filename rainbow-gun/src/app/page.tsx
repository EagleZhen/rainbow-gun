'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import GunSelector from '@/components/GunSelector';
import ChordSelector from '@/components/ChordSelector';
import SubBassPanel from '@/components/SubBassPanel';
import EffectsPanel from '@/components/EffectsPanel';
import TriggerPanel from '@/components/TriggerPanel';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { knobValueToPitchIndex } from '@/data/notes';
import { guns } from '@/data/guns';

export default function Home() {
  const { engine, initEngine } = useAudioEngine();
  const [selectedKnob, setSelectedKnob] = useState<string | null>(null);
  const [selectedChord, setSelectedChord] = useState<'major' | 'minor'>('major');
  const [selectedGunIds, setSelectedGunIds] = useState<Set<string>>(new Set());
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});
  const [knobValues, setKnobValues] = useState({
    // Sub Bass
    subLevel: 0.4,
    subPower: 0.5,
    subPunch: 0.6,
    subFuzz: 0.3,
    // Effects
    master: 0.8,
    pitch: 0.5,
    reverb: 0.3,
    rainbowlize: 0.5,
    power: 0.6,
    oct: 0.5,
    attack: 0.05,
    decay: 0.52,
    sustain: 0.5,
    release: 0.25,
    // Trigger
    fireRate: 0.5,
  });

  const handleKnobSelect = (knobId: string) => {
    setSelectedKnob(prev => prev === knobId ? null : knobId);
  };

  const KNOB_ADJUSTMENT_STEP = 0.02; // 2% adjustment per keypress
  const PITCH_STEP = 1 / 12; // One semitone (12 pitches total)
  const clampValue = (value: number) => Math.max(0, Math.min(1, value));

  // Fire trigger: play audio + show visual feedback
  const fireGun = useCallback(async (gunId: string) => {
    // Show visual feedback: highlight the gun button
    setSelectedGunIds(prev => new Set(prev).add(gunId));

    // Clear any existing timeout for this gun
    if (timeoutRefs.current[gunId]) {
      clearTimeout(timeoutRefs.current[gunId]);
    }

    // Auto-deselect after 1 second
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

      // Handle number keys for gun selection/firing
      const keyNum = parseInt(e.key);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= guns.length) {
        const gun = guns[keyNum - 1];
        fireGun(gun.id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedKnob, fireGun, PITCH_STEP, KNOB_ADJUSTMENT_STEP]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(timeoutRefs.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">The Rainbow Gun</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL - Gun Selection & Sub Bass */}
          <div className="space-y-6">
            <GunSelector selectedGunIds={selectedGunIds} onFire={fireGun} />
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
      </div>
    </div>
  );
}
