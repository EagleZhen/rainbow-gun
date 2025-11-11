'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SelectableGridItemProps {
  id: string;
  label: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: (id: string) => void;
}

export default function SelectableGridItem({
  id,
  label,
  imageUrl,
  isSelected,
  onClick,
}: SelectableGridItemProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <button
      onClick={() => onClick(id)}
      className={`flex flex-col items-center gap-2 p-3 rounded border-2 transition-colors cursor-pointer ${
        isSelected
          ? 'border-blue-500 bg-blue-50'
          : 'border-gray-300 bg-white hover:bg-gray-100'
      }`}
      title={label}
    >
      <div className="relative w-12 h-12">
        {!imageError ? (
          <Image
            src={imageUrl}
            alt={label}
            fill
            className="object-contain"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded" />
        )}
      </div>
      <span className="text-xs font-medium text-center truncate w-full">
        {label}
      </span>
    </button>
  );
}
