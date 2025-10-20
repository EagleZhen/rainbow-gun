interface KnobProps {
  label: string;
  value?: number;
  min?: number;
  max?: number;
  onChange?: (value: number) => void;
  subtitle?: string;
}

export default function Knob({ label, value = 0.5, min = 0, max = 1, subtitle }: KnobProps) {
  const rotation = (value - min) / (max - min) * 270 - 135;

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative w-12 h-12 rounded-full border-2 border-gray-400 bg-white">
        <div
          className="absolute w-0.5 h-4 bg-black rounded-full left-1/2 top-2"
          style={{
            transform: `translateX(-50%) rotate(${rotation}deg)`,
            transformOrigin: 'center 16px'
          }}
        />
      </div>
      <span className="text-xs font-medium uppercase text-black">{label}</span>
      {subtitle && <span className="text-[10px] text-black">({subtitle})</span>}
    </div>
  );
}
