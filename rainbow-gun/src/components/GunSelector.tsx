export default function GunSelector() {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="text-xs font-semibold mb-3">GUN SELECTOR</div>

      {/* Category selector */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <button>←</button>
        <div className="px-4 py-1">Rifle</div>
        <button>→</button>
      </div>

      {/* Gun slider - placeholder boxes */}
      <div className="flex gap-2 overflow-x-auto">
        <div className="w-16 h-16 border border-gray-300 rounded shrink-0" />
        <div className="w-16 h-16 border border-gray-300 rounded shrink-0" />
        <div className="w-16 h-16 border border-gray-300 rounded shrink-0" />
        <div className="w-16 h-16 border border-gray-300 rounded shrink-0" />
      </div>
    </div>
  );
}
