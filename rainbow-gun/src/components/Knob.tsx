interface KnobProps {
  id: string;
  label: string;
  value: number;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
  subtitle?: string;
  rainbow?: boolean;
}

export default function Knob({
  id,
  label,
  value,
  isSelected = false,
  onSelect,
  subtitle,
  rainbow = false
}: KnobProps) {
  // Maps value (0-1) to rotation: 270° range from -135° (left) to +135° (right)
  const rotation = value * 270 - 135;

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
        } ${!rainbow ? 'bg-white' : ''}`}
        style={rainbow ? {
          background: 'linear-gradient(to right, #FF4444, #FF8C00, #FFD700, #22DD88, #4466FF, #BB55FF)',
          filter: `saturate(${value})`
        } : undefined}
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
