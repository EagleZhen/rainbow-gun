import Knob from './Knob';
import Keycap from './Keycap';
import type { PanelProps } from '@/types/panel';
import { pitchIndexToNote, knobValueToPitchIndex } from '@/data/notes';

export default function EffectsPanel({
  knobValues,
  selectedKnob
}: PanelProps) {
  return (
    <div className="border border-gray-300 rounded p-6 bg-white">
      <div className="text-xs font-semibold mb-3">MASTER EFFECTS</div>
      <div className="grid grid-cols-3 gap-6 justify-items-center mb-6">
        <Knob
          id="master"
          label="Master"
          value={knobValues.master}
          subtitle="volume"
          isSelected={selectedKnob === 'master'}
        />
        <Knob
          id="reverb"
          label="Reverb"
          value={knobValues.reverb}
          isSelected={selectedKnob === 'reverb'}
        />
        <Knob
          id="power"
          label="Power"
          value={knobValues.power}
          subtitle="distortion"
          isSelected={selectedKnob === 'power'}
        />
      </div>

      <div className="border-t border-gray-300 pt-6">
        <div className="mb-3 flex flex-wrap items-center gap-x-2 gap-y-1">
          <div className="flex min-h-4 items-center text-xs font-semibold leading-none">TONE CONTROL</div>
          <div className="flex min-h-4 flex-wrap items-center gap-1 text-xs leading-none text-gray-500">
            <Keycap>Z</Keycap>
            <Keycap>X</Keycap>
            <Keycap>C</Keycap>
            <Keycap>V</Keycap>
            <Keycap>B</Keycap>
            <Keycap>N</Keycap>
            <Keycap>M</Keycap>
            <span>white notes</span>
            <span className="mx-1">·</span>
            <Keycap>S</Keycap>
            <Keycap>D</Keycap>
            <Keycap>G</Keycap>
            <Keycap>H</Keycap>
            <Keycap>J</Keycap>
            <span>black notes</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6 justify-items-center">
          <Knob
            id="rainbowlize"
            label="Rainbowlize"
            value={knobValues.rainbowlize}
            subtitle="wet/dry"
            rainbow
            isSelected={selectedKnob === 'rainbowlize'}
          />
          <div className="flex flex-col items-center gap-2">
            <Knob
              id="pitch"
              label="Pitch"
              value={knobValues.pitch}
              subtitle="root note"
              isSelected={selectedKnob === 'pitch'}
            />
            <div className="text-xs font-semibold text-gray-600 uppercase">
              {pitchIndexToNote(knobValueToPitchIndex(knobValues.pitch))}
            </div>
          </div>
          <Knob
            id="octave"
            label="Octave"
            value={knobValues.octave}
            isSelected={selectedKnob === 'octave'}
            disabled
          />
        </div>
      </div>
    </div>
  );
}
