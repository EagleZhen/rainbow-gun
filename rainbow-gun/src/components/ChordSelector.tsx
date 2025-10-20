export default function ChordSelector() {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="text-xs font-semibold mb-2">CHORD SELECTOR</div>
      <div className="flex items-center justify-center gap-2">
        <button>←</button>
        <div className="px-3 py-1 border border-gray-300 rounded text-sm">Type</div>
        <button>→</button>
      </div>
    </div>
  );
}
