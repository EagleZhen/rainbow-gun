import Knob from './Knob';
import type { PanelProps } from '@/types/panel';

export default function TriggerPanel({
  knobValues,
  selectedKnob,
  onKnobSelect
}: PanelProps) {
  return (
    <div className="border border-gray-300 rounded p-6 bg-white">
      <div className="text-xs font-semibold mb-3 text-center">TRIGGER</div>
      <div className="flex flex-col items-center gap-6">
        <div className="w-32 h-32 border border-gray-300 rounded" />
        <div className="flex flex-col items-center gap-2">
          <Knob
            id="fireRate"
            label="Fire Rate"
            value={knobValues.fireRate}
            subtitle="Single ← → Burst"
            isSelected={selectedKnob === 'fireRate'}
            onSelect={onKnobSelect}
          />
        </div>
      </div>
    </div>
  );
}
