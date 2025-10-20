import GunSelector from '@/components/GunSelector';
import ChordSelector from '@/components/ChordSelector';
import SubBassPanel from '@/components/SubBassPanel';
import EffectsPanel from '@/components/EffectsPanel';
import TriggerPanel from '@/components/TriggerPanel';

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">The Rainbow Gun</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* LEFT PANEL - Gun Selection & Sub Bass */}
          <div className="space-y-6">
            <GunSelector />
            <ChordSelector />
            <SubBassPanel />
          </div>

          {/* RIGHT PANEL - Effects & Trigger */}
          <div className="space-y-6">
            <EffectsPanel />
            <TriggerPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
