import Knob from './Knob';
import type { PanelProps } from '@/types/panel';

export default function SubBassPanel({
  knobValues,
  selectedKnob,
  onKnobSelect
}: PanelProps) {
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

      <div className="grid grid-cols-4 gap-3 pt-2">
        <Knob
          id="attack"
          label="Attack"
          value={knobValues.attack}
          isSelected={selectedKnob === 'attack'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="decay"
          label="Decay"
          value={knobValues.decay}
          isSelected={selectedKnob === 'decay'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="sustain"
          label="Sustain"
          value={knobValues.sustain}
          isSelected={selectedKnob === 'sustain'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="release"
          label="Release"
          value={knobValues.release}
          isSelected={selectedKnob === 'release'}
          onSelect={onKnobSelect}
        />
      </div>

      <div className="grid grid-cols-4 gap-3 pt-2">
        <Knob
          id="subLevel"
          label="Sub Level"
          value={knobValues.subLevel}
          subtitle="volume"
          isSelected={selectedKnob === 'subLevel'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="subPower"
          label="Sub Power"
          value={knobValues.subPower}
          subtitle="distortion"
          isSelected={selectedKnob === 'subPower'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="subPunch"
          label="Sub Punch"
          value={knobValues.subPunch}
          subtitle="pitch drop"
          isSelected={selectedKnob === 'subPunch'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="subFuzz"
          label="Sub Fuzz"
          value={knobValues.subFuzz}
          subtitle="white noise"
          isSelected={selectedKnob === 'subFuzz'}
          onSelect={onKnobSelect}
        />
      </div>
    </div>
  );
}
