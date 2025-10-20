import GunSelector from '@/components/GunSelector';
import ControlPanel from '@/components/ControlPanel';
import TriggerButton from '@/components/TriggerButton';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">The Rainbow Gun</h1>

        <div className="flex flex-col gap-6">
          {/* Gun Selection */}
          <GunSelector />

          {/* Main Controls */}
          <ControlPanel />

          {/* Trigger */}
          <TriggerButton />
        </div>
      </div>
    </div>
  );
}
