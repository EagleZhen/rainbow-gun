'use client';

import { useState, useEffect } from 'react';
import GunSelector from '@/components/GunSelector';
import ChordSelector from '@/components/ChordSelector';
import SubBassPanel from '@/components/SubBassPanel';
import EffectsPanel from '@/components/EffectsPanel';
import TriggerPanel from '@/components/TriggerPanel';
import { useAudioEngine } from '@/hooks/useAudioEngine';
import { knobValueToPitchIndex } from '@/data/notes';

export default function Home() {
  const { engine, initEngine } = useAudioEngine();
  const [selectedKnob, setSelectedKnob] = useState<string | null>(null);
  const [selectedGun, setSelectedGun] = useState<string>('scout');
  const [selectedChord, setSelectedChord] = useState<'major' | 'minor'>('major');
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
  const clampValue = (value: number) => Math.max(0, Math.min(1, value));

  // Fire trigger: play dry gun + wet sample with selected pitch/chord
  const handleFireWithGun = async (gunId: string) => {
    setSelectedGun(gunId);

    if (!engine) return;

    // Initialize audio context on first interaction
    await initEngine();

    // Play both dry and wet sounds with the fired gun
    engine.playGun(gunId);
    engine.playWetGun(gunId, knobValueToPitchIndex(knobValues.pitch), selectedChord);
  };

  // Convenience wrapper for firing with currently selected gun
  const handleFire = () => handleFireWithGun(selectedGun);

  // Wire rainbowlize knob to AudioEngine crossfade
  useEffect(() => {
    if (engine) {
      engine.setCrossfadeAmount(knobValues.rainbowlize);
    }
  }, [engine, knobValues.rainbowlize]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedKnob) return;

      let delta = 0;
      if (e.key === 'ArrowUp') delta = KNOB_ADJUSTMENT_STEP;
      else if (e.key === 'ArrowDown') delta = -KNOB_ADJUSTMENT_STEP;
      else return;

      e.preventDefault();
      setKnobValues(prev => {
        const currentValue = prev[selectedKnob as keyof typeof prev];
        return {
          ...prev,
          [selectedKnob]: clampValue(currentValue + delta)
        };
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedKnob]);

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">The Rainbow Gun</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL - Gun Selection & Sub Bass */}
          <div className="space-y-6">
            <GunSelector selectedGun={selectedGun} onFire={handleFireWithGun} />
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
