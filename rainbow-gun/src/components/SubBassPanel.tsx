import Knob from './Knob';

export default function SubBassPanel() {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="text-xs font-semibold mb-3">SUB BASS</div>

      <div className="mb-3">
        <div className="flex items-center justify-center gap-2 mb-2">
          <button>←</button>
          <div className="px-4 py-1">Sine</div>
          <button>→</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-20 border border-gray-300 rounded" />
          <div className="h-20 border border-gray-300 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3 pt-2 border-gray-300">
        <Knob label="Attack" value={0.05}/>
        <Knob label="Decay" value={0.52}/>
        <Knob label="Sustain" value={0.5}/>
        <Knob label="Release" value={0.25}/>
      </div>
    </div>
  );
}
