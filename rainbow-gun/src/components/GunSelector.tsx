export default function GunSelector() {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <div className="text-xs font-semibold mb-2">THE GUN</div>
      <div className="flex items-center justify-center gap-2 mb-2">
        <button>←</button>
        <div className="px-4 py-1 border border-gray-300 rounded">AK47</div>
        <button>→</button>
      </div>
      <div className="h-24 border border-gray-300 rounded" />
    </div>
  );
}
