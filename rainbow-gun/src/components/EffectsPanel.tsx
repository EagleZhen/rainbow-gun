import Knob from './Knob';
import type { PanelProps } from '@/types/panel';
import { pitchIndexToNote, knobValueToPitchIndex } from '@/data/notes';

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
        <div className="flex flex-col items-center gap-2">
          <Knob
            id="pitch"
            label="Pitch"
            value={knobValues.pitch}
            subtitle="root note"
            isSelected={selectedKnob === 'pitch'}
            onSelect={onKnobSelect}
          />
          <div className="text-xs font-semibold text-gray-600 uppercase">
            {pitchIndexToNote(knobValueToPitchIndex(knobValues.pitch))}
          </div>
        </div>
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
    </div>
  );
}
