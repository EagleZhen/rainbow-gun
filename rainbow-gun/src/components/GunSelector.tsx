'use client';

import { useState, useEffect, useCallback } from 'react';
import { guns } from '@/data/guns';
import SelectableGridItem from './SelectableGridItem';
import { useAudioEngine } from '@/hooks/useAudioEngine';

export default function GunSelector() {
  const [selectedGunIds, setSelectedGunIds] = useState<Set<string>>(new Set());
  const { engine, initEngine, ready } = useAudioEngine();

  const playGunSound = useCallback((gunId: string) => {
    if (!engine || !ready) return;

    // Initialize audio context on first interaction
    initEngine().catch(console.error);

    // Play gun sound
    setSelectedGunIds(prev => new Set(prev).add(gunId));
    engine.playGun(gunId);

    // Auto-deselect after sound duration (estimate: 1 second for gun samples)
    const timeout = setTimeout(() => {
      setSelectedGunIds(prev => {
        const next = new Set(prev);
        next.delete(gunId);
        return next;
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [engine, initEngine, ready]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyNum = parseInt(e.key);
      if (isNaN(keyNum) || keyNum < 1 || keyNum > guns.length) return;

      const gun = guns[keyNum - 1];
      playGunSound(gun.id);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playGunSound]);

  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="text-xs font-semibold mb-3">GUN SELECTOR</div>

      {/* Guns grid */}
      <div className="grid grid-cols-3 gap-2">
        {guns.map(gun => (
          <SelectableGridItem
            key={gun.id}
            id={gun.id}
            label={gun.name}
            imageUrl={gun.imageUrl}
            isSelected={selectedGunIds.has(gun.id)}
            onClick={playGunSound}
          />
        ))}
      </div>
    </div>
  );
}
