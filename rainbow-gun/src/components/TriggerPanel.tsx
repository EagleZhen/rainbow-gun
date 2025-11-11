import Knob from './Knob';

export default function TriggerPanel() {
  return (
    <div className="border border-gray-300 rounded p-6 bg-white">
      <div className="text-xs font-semibold mb-3 text-center">TRIGGER</div>
      <div className="flex flex-col items-center gap-6">
        <div className="w-32 h-32 border border-gray-300 rounded" />
        <div className="flex flex-col items-center gap-2">
          <Knob label="Fire Rate" value={0.5} subtitle="Single ← → Burst" />
        </div>
      </div>
    </div>
  );
}
