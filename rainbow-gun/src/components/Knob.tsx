interface KnobProps {
  id: string;
  label: string;
  value: number;
  min?: number;
  max?: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  subtitle?: string;
  rainbow?: boolean;
}

export default function Knob({
  id,
  label,
  value,
  min = 0,
  max = 1,
  isSelected = false,
  onSelect,
  subtitle,
  rainbow = false
}: KnobProps) {
  // Maps value to rotation: 270° range from -135° (left) to +135° (right)
  const rotation = (value - min) / (max - min) * 270 - 135;

  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer"
      onClick={() => onSelect?.(id)}
    >
      {/* Knob circle */}
      <div
        className={`relative w-12 h-12 rounded-full border-2 transition-all ${
          isSelected
            ? 'border-blue-500 shadow-lg shadow-blue-300'
            : 'border-gray-300'
        } ${rainbow ? 'bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400' : 'bg-white'}`}
      >
        {!rainbow && (
          <div
            className="absolute w-px h-4 bg-black rounded-full left-1/2 top-2"
            style={{
              transform: `translateX(-50%) rotate(${rotation}deg)`,
              transformOrigin: 'center 16px'
            }}
          />
        )}
      </div>

      {/* Label */}
      <span className="text-xs font-medium uppercase">{label}</span>

      {/* Value display */}
      <span className="text-[10px] font-mono tabular-nums">
        {value.toFixed(2)}
      </span>

      {/* Subtitle */}
      {subtitle && <span className="text-[10px]">({subtitle})</span>}
    </div>
  );
}
