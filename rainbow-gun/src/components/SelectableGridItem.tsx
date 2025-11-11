'use client';

import Image from 'next/image';
import { useState } from 'react';

interface SelectableGridItemProps {
  id: string;
  label: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: (id: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-14 h-14',
  lg: 'w-18 h-18',
};

export default function SelectableGridItem({
  id,
  label,
  imageUrl,
  isSelected,
  onClick,
  size = 'md',
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
      <div className={`relative ${sizeClasses[size]}`}>
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
