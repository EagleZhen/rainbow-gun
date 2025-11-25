interface ChordSelectorProps {
  selectedChord: 'major' | 'minor';
  onSelectChord: (chord: 'major' | 'minor') => void;
}

export default function ChordSelector({ selectedChord, onSelectChord }: ChordSelectorProps) {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="text-xs font-semibold mb-3">CHORD SELECTOR</div>
      <div className="flex gap-2">
        <button
          className={`px-3 py-1 border rounded text-sm ${selectedChord === 'major' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onClick={() => onSelectChord('major')}
        >
          Major
        </button>
        <button
          className={`px-3 py-1 border rounded text-sm ${selectedChord === 'minor' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          onClick={() => onSelectChord('minor')}
        >
          Minor
        </button>
      </div>
    </div>
  );
}
