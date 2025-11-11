'use client';

import { useState } from 'react';
import GunSelector from '@/components/GunSelector';
import ChordSelector from '@/components/ChordSelector';
import SubBassPanel from '@/components/SubBassPanel';
import EffectsPanel from '@/components/EffectsPanel';
import TriggerPanel from '@/components/TriggerPanel';

export default function Home() {
  const [selectedKnob, setSelectedKnob] = useState<string | null>(null);
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
    rainbowlize: 0.7,
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
    setSelectedKnob(knobId);
  };

  const updateKnobValue = (knobId: string, newValue: number) => {
    setKnobValues(prev => ({
      ...prev,
      [knobId]: Math.max(0, Math.min(1, newValue))
    }));
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">The Rainbow Gun</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL - Gun Selection & Sub Bass */}
          <div className="space-y-6">
            <GunSelector />
            <ChordSelector />
            <SubBassPanel />
          </div>

          {/* RIGHT PANEL - Effects & Trigger */}
          <div className="space-y-6">
            <EffectsPanel />
            <TriggerPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
