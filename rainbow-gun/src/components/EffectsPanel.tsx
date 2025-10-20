import Knob from './Knob';

export default function EffectsPanel() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6 justify-items-center">
        <Knob label="Master" value={0.8} subtitle="volume" />
        <Knob label="Pitch" value={0.5} subtitle="root note" />
        <Knob label="Reverb" value={0.3} />
      </div>

      <div className="grid grid-cols-3 gap-6 justify-items-center">
        <Knob label="Rainbowlize" value={0.7} subtitle="wet/dry" rainbow />
        <Knob label="Power" value={0.6} subtitle="distortion" />
        <Knob label="Oct" value={0.5} />
      </div>

      <div className="grid grid-cols-4 gap-4 justify-items-center">
        <Knob label="Sub Level" value={0.4} subtitle="volume" />
        <Knob label="Sub Power" value={0.5} subtitle="distortion" />
        <Knob label="Sub Punch" value={0.6} subtitle="pitch drop" />
        <Knob label="Sub Fuzz" value={0.3} subtitle="white noise" />
      </div>
    </div>
  );
}
