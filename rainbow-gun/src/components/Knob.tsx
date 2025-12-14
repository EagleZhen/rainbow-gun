interface KnobProps {
  id: string;
  label: string;
  value: number;
  isSelected?: boolean;
  subtitle?: string;
  rainbow?: boolean;
  disabled?: boolean;
}

const RAINBOW_GRADIENT = 'linear-gradient(to right, #FF4444, #FF8C00, #FFD700, #22DD88, #4466FF, #BB55FF)';

export default function Knob({
  id,
  label,
  value,
  isSelected = false,
  subtitle,
  rainbow = false,
  disabled = false
}: KnobProps) {
  // Maps value (0-1) to rotation: 270° range from -135° (left) to +135° (right)
  const rotation = value * 270 - 135;

  return (
    <div
      className={`flex flex-col items-center gap-1 ${
        disabled ? 'cursor-not-allowed opacity-40' : 'cursor-grab active:cursor-grabbing'
      }`}
      data-knob-id={disabled ? undefined : id}
    >
      {/* Knob circle */}
      <div
        className={`relative w-12 h-12 rounded-full border-2 transition-all ${
          disabled
            ? 'border-gray-200 bg-gray-50'
            : isSelected
            ? 'border-blue-500 shadow-lg shadow-blue-300'
            : 'border-gray-300'
        } ${!rainbow && !disabled ? 'bg-white' : ''}`}
        style={rainbow && !disabled ? {
          background: RAINBOW_GRADIENT,
          filter: `saturate(${value})`
        } : undefined}
      >
        {!rainbow && (
          <div
            className={`absolute w-px h-4 rounded-full left-1/2 top-2 ${
              disabled ? 'bg-gray-300' : 'bg-black'
            }`}
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

      {/* Subtitle or disabled hint */}
      {disabled ? (
        <span className="text-[10px] text-gray-400 italic">Not Implemented Yet</span>
      ) : (
        subtitle && <span className="text-[10px]">({subtitle})</span>
      )}
    </div>
  );
}
