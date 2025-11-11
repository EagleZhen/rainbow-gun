'use client';

import { useState } from 'react';
import { guns } from '@/data/guns';
import SelectableGridItem from './SelectableGridItem';

export default function GunSelector() {
  const [selectedGunId, setSelectedGunId] = useState<string>('scout');

  const playGunSound = (gunId: string) => {
    const gun = guns.find(g => g.id === gunId);
    if (!gun) return;

    const audio = new Audio(gun.soundUrl);
    audio.play().catch(() => {
      // Silently fail if audio can't play
    });
  };

  const handleSelectGun = (gunId: string) => {
    setSelectedGunId(gunId);
    playGunSound(gunId);
  };

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
            isSelected={selectedGunId === gun.id}
            onClick={handleSelectGun}
          />
        ))}
      </div>
    </div>
  );
}
