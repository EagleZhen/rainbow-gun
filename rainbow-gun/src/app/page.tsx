import GunSelector from '@/components/GunSelector';
import ChordSelector from '@/components/ChordSelector';
import SubBassSection from '@/components/SubBassSection';
import EffectsPanel from '@/components/EffectsPanel';
import TriggerSection from '@/components/TriggerSection';

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
            <SubBassSection />
          </div>

          {/* RIGHT PANEL - Effects & Trigger */}
          <div className="space-y-6">
            <div className="border-2 border-gray-300 rounded-lg p-6 bg-white shadow-sm">
              <EffectsPanel />
            </div>
            <TriggerSection />
          </div>
        </div>
      </div>
    </div>
  );
}
