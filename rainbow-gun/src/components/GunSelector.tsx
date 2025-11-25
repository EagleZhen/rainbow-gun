'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { guns } from '@/data/guns';
import SelectableGridItem from './SelectableGridItem';
import { useAudioEngine } from '@/hooks/useAudioEngine';

export default function GunSelector() {
  const [selectedGunIds, setSelectedGunIds] = useState<Set<string>>(new Set());
  const { engine, initEngine, ready } = useAudioEngine();
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const playGunSound = useCallback(async (gunId: string) => {
    if (!engine || !ready) return;

    // Initialize audio context on first interaction
    await initEngine();

    // Play gun sound
    setSelectedGunIds(prev => new Set(prev).add(gunId));
    engine.playGun(gunId);

    // Auto-deselect after sound duration (estimate: 1 second for gun samples)
    // Clear any existing timeout for this gun
    if (timeoutRefs.current[gunId]) {
      clearTimeout(timeoutRefs.current[gunId]);
    }

    timeoutRefs.current[gunId] = setTimeout(() => {
      setSelectedGunIds(prev => {
        const next = new Set(prev);
        next.delete(gunId);
        return next;
      });
      delete timeoutRefs.current[gunId];
    }, 1000);
  }, [engine, initEngine, ready]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const keyNum = parseInt(e.key);
      if (isNaN(keyNum) || keyNum < 1 || keyNum > guns.length) return;

      const gun = guns[keyNum - 1];
      playGunSound(gun.id).catch(console.error);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playGunSound]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    const refs = timeoutRefs.current;
    return () => {
      Object.values(refs).forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs font-semibold">GUN SELECTOR</div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <div className={`w-2 h-2 rounded-full transition-colors ${ready ? 'bg-green-600' : 'bg-gray-400'}`}></div>
          <span className="text-gray-600">{ready ? 'Ready' : 'Loading'}</span>
        </div>
      </div>

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
