import Keycap from './Keycap';

interface ChordSelectorProps {
  selectedChord: 'major' | 'minor';
  onSelectChord: (chord: 'major' | 'minor') => void;
}

export default function ChordSelector({ selectedChord, onSelectChord }: ChordSelectorProps) {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
        <div className="flex min-h-4 items-center text-xs font-semibold leading-none">CHORD SELECTOR</div>
        <div className="flex min-h-4 flex-wrap items-center gap-1 text-xs leading-none text-gray-500">
          <span>Use</span>
          <Keycap>[</Keycap>
          <Keycap>]</Keycap>
          <span>to switch</span>
        </div>
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
