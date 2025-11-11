import Knob from './Knob';
import type { PanelProps } from '@/types/panel';

export default function EffectsPanel({
  knobValues,
  selectedKnob,
  onKnobSelect
}: PanelProps) {
  return (
    <div className="border border-gray-300 rounded p-6 bg-white space-y-6">
      <div className="grid grid-cols-3 gap-6 justify-items-center">
        <Knob
          id="master"
          label="Master"
          value={knobValues.master}
          subtitle="volume"
          isSelected={selectedKnob === 'master'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="pitch"
          label="Pitch"
          value={knobValues.pitch}
          subtitle="root note"
          isSelected={selectedKnob === 'pitch'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="reverb"
          label="Reverb"
          value={knobValues.reverb}
          isSelected={selectedKnob === 'reverb'}
          onSelect={onKnobSelect}
        />
      </div>

      <div className="grid grid-cols-3 gap-6 justify-items-center">
        <Knob
          id="rainbowlize"
          label="Rainbowlize"
          value={knobValues.rainbowlize}
          subtitle="wet/dry"
          rainbow
          isSelected={selectedKnob === 'rainbowlize'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="power"
          label="Power"
          value={knobValues.power}
          subtitle="distortion"
          isSelected={selectedKnob === 'power'}
          onSelect={onKnobSelect}
        />
        <Knob
          id="oct"
          label="Oct"
          value={knobValues.oct}
          isSelected={selectedKnob === 'oct'}
          onSelect={onKnobSelect}
        />
      </div>

      <div className="grid grid-cols-4 gap-4 justify-items-center">
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
