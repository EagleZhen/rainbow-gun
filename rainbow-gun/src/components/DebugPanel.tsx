'use client';

import { ReactNode } from 'react';

interface DebugItem {
  label: string;
  value: ReactNode;
}

interface DebugPanelProps {
  items?: DebugItem[];
}

export default function DebugPanel({ items = [] }: DebugPanelProps) {
  return (
    <div className="mt-8 border-t pt-4">
      <div className="border border-gray-300 rounded p-4 bg-white text-xs font-mono">
        <h3 className="font-bold mb-3 text-sm">DEBUG</h3>
        {items.length === 0 ? (
          <div className="text-gray-500">No debug items</div>
        ) : (
          <div className="space-y-1">
            {items.map((item, idx) => (
              <div key={idx} className="text-gray-700">
                <span className="font-bold">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
