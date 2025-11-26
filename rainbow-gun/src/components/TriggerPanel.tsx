import Knob from './Knob';
import type { PanelProps } from '@/types/panel';

export default function TriggerPanel({
  knobValues,
  selectedKnob,
  onKnobSelect
}: PanelProps) {
  return (
    <div className="border border-gray-300 rounded p-6 bg-white">
      <div className="text-xs font-semibold mb-3">TRIGGER</div>
      <div className="flex items-center gap-6">
        {/* <div className="w-36 h-36 border border-gray-300 rounded shrink-0" /> */}
        <Knob
          id="fireRate"
          label="Fire Rate"
          value={knobValues.fireRate}
          subtitle="Single ← → Burst"
          isSelected={selectedKnob === 'fireRate'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="gunLevel"
          label="Gun Level"
          value={knobValues.gunLevel}
          subtitle="volume"
          isSelected={selectedKnob === 'gunLevel'}
          onSelect={onKnobSelect}
        />
      </div>
    </div>
  );
}
