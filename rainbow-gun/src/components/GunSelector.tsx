'use client';

import { guns } from '@/data/guns';
import SelectableGridItem from './SelectableGridItem';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface GunSelectorProps {
  selectedGunIds: Set<string>; // Temporarily highlighted (just fired)
  activeGunId: string; // Persistently selected gun
  onFire: (gunId: string) => void;
}

export default function GunSelector({ selectedGunIds, activeGunId, onFire }: GunSelectorProps) {
  const { ready } = useAudioEngine();

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
            isActive={gun.id === activeGunId}
            onClick={onFire}
          />
        ))}
      </div>
    </div>
  );
}
