'use client';

interface DebugItem {
  label: string;
  value: string;
}

interface DebugPanelProps {
  items?: DebugItem[];
  onRequestMIDI?: () => void;
}

export default function DebugPanel({ items = [], onRequestMIDI }: DebugPanelProps) {
  return (
    <div className="mt-8 border-t pt-4">
      <div className="border border-gray-300 rounded p-4 bg-white text-xs font-mono">
        <h3 className="font-bold mb-3 text-sm">DEBUG</h3>

        {items.length === 0 ? (
          <div className="text-gray-500">No debug info</div>
        ) : (
          <div className="space-y-1">
            {items.map((item, idx) => (
              <div key={idx} className="text-gray-700">
                <span className="font-bold">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        )}

        {onRequestMIDI && (
          <button
            onClick={onRequestMIDI}
            className="mt-3 w-full px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            Request MIDI Access
          </button>
        )}
      </div>
    </div>
  );
}
