'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { guns } from '@/data/guns';
import SelectableGridItem from './SelectableGridItem';

export default function GunSelector() {
  const [selectedGunIds, setSelectedGunIds] = useState<Set<string>>(new Set());
  const audioRefMap = useRef<Record<string, HTMLAudioElement | null>>({});

  const playGunSound = useCallback((gunId: string) => {
    const gun = guns.find(g => g.id === gunId);
    if (!gun) return;

    setSelectedGunIds(prev => new Set(prev).add(gunId));

    const audio = new Audio(gun.soundUrl);
    audioRefMap.current[gunId] = audio;

    audio.addEventListener(
      'ended',
      () => {
        if (audioRefMap.current[gunId] === audio) {
          setSelectedGunIds(prev => {
            const next = new Set(prev);
            next.delete(gunId);
            return next;
          });
        }
      },
      { once: true }
    );

    audio.play().catch(() => {});
  }, []);

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
