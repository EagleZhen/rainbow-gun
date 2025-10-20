export default function ChordSelector() {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="text-xs font-semibold mb-3">CHORD SELECTOR</div>
      <div className="flex gap-2">
        <button className="px-3 py-1 border border-gray-300 rounded text-sm">Power</button>
        <button className="px-3 py-1 border border-gray-300 rounded text-sm">Major</button>
        <button className="px-3 py-1 border border-gray-300 rounded text-sm">Minor</button>
        <button className="px-3 py-1 border border-gray-300 rounded text-sm">7th</button>
      </div>
    </div>
  );
}
