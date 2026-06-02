interface ChordSelectorProps {
  selectedChord: 'major' | 'minor';
  onSelectChord: (chord: 'major' | 'minor') => void;
}

export default function ChordSelector({ selectedChord, onSelectChord }: ChordSelectorProps) {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="mb-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <div className="text-xs font-semibold">CHORD SELECTOR</div>
        <div className="text-xs text-gray-500">Use [ and ] to switch</div>
      </div>
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 border rounded text-sm cursor-pointer ${selectedChord === 'major' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onClick={() => onSelectChord('major')}
        >
          Major
        </button>
        <button
          className={`px-3 py-1 border rounded text-sm cursor-pointer ${selectedChord === 'minor' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onClick={() => onSelectChord('minor')}
        >
          Minor
        </button>
      </div>
    </div>
  );
}
