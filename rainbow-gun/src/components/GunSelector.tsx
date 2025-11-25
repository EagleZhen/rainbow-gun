'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { guns } from '@/data/guns';
import SelectableGridItem from './SelectableGridItem';
import { useAudioEngine } from '@/hooks/useAudioEngine';

interface GunSelectorProps {
  selectedGun: string;
  onFire: (gunId: string) => void;
}

export default function GunSelector({ selectedGun, onFire }: GunSelectorProps) {
  const [selectedGunIds, setSelectedGunIds] = useState<Set<string>>(new Set());
  const { ready } = useAudioEngine();
  const timeoutRefs = useRef<Record<string, NodeJS.Timeout>>({});

  const handleFireGun = useCallback((gunId: string) => {
    // Call the onFire callback from parent
    onFire(gunId);

    // Visual feedback: highlight the gun button
    setSelectedGunIds(prev => new Set(prev).add(gunId));

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
  }, [onFire]);


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
            onClick={handleFireGun}
          />
        ))}
      </div>
    </div>
  );
}
