export default function TriggerPanel() {
  return (
    <div className="border border-gray-300 rounded p-6 bg-white">
      <div className="text-xs font-semibold mb-3 text-center">TRIGGER</div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-32 h-32 border border-gray-300 rounded" />
        <div className="flex items-center gap-2">
          <span className="text-xs">Single</span>
          <div className="w-10 h-5 border border-gray-300 rounded-full relative bg-gray-100">
            <div className="w-3.5 h-3.5 bg-white border border-gray-300 rounded-full absolute top-0.5 left-0.5" />
          </div>
          <span className="text-xs">Burst</span>
        </div>
      </div>
    </div>
  );
}
