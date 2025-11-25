'use client';

import { useMIDI } from '@/hooks/useMIDI';

export default function MIDIDebugPanel() {
  const { midiAccess, error, isSupported, requestMIDIAccess } = useMIDI();

  return (
    <div className="mt-8 border-t pt-4">
      <div className="border border-gray-300 rounded p-4 bg-gray-50">
        <h3 className="text-sm font-bold mb-3">MIDI DEBUG PANEL</h3>

        {/* MIDI Support Status */}
        <div className="mb-4 p-3 bg-white rounded border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold">Web MIDI API Support:</span>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded ${
                isSupported ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {isSupported ? 'Supported' : 'Not Supported'}
            </span>
          </div>

          {!isSupported && (
            <p className="text-xs text-red-600 mt-2">
              Web MIDI API is not available in your browser. Please use Chrome, Edge, or Opera.
            </p>
          )}

          {error && (
            <p className="text-xs text-red-600 mt-2">
              Error: {error}
            </p>
          )}
        </div>

        {/* Request MIDI Access Button */}
        {isSupported && !midiAccess && (
          <button
            onClick={requestMIDIAccess}
            className="w-full px-3 py-2 bg-blue-600 text-white text-xs font-semibold rounded hover:bg-blue-700 transition-colors"
          >
            Request MIDI Access
          </button>
        )}
      </div>
    </div>
  );
}
