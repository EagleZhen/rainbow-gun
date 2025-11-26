'use client';

import { useRef, useEffect, useState } from 'react';
import { SubBassParams } from '@/lib/AudioEngine';

interface IAudioEngine {
  isInitialized(): boolean;
  init(): Promise<void>;
  playGun(id: string): void;
  playWetGun(id: string, pitchIndex: number, chordType: 'major' | 'minor'): void;
  setCrossfadeAmount(amount: number): void;
  fireSubBass(): void;
  releaseSubBass(): void;
  setSubParameters(params: SubBassParams): void;
  dispose(): void;
}

/**
 * React hook to manage AudioEngine instance
 * Dynamically imports Tone.js (browser-only) on component mount
 * Initializes audio context on first user interaction
 */
export function useAudioEngine() {
  const engineRef = useRef<IAudioEngine | null>(null);
  const [ready, setReady] = useState(false);

  // Dynamically import and create engine on mount (browser-only)
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Import only when component mounts (guaranteed browser context)
        const { AudioEngine } = await import('@/lib/AudioEngine');

        if (mounted) {
          engineRef.current = new AudioEngine();
          setReady(true);
        }
      } catch (error) {
        console.error('Failed to load AudioEngine:', error);
      }
    })();

    return () => {
      mounted = false;
      // Cleanup on unmount
      if (engineRef.current) {
        engineRef.current.dispose();
        engineRef.current = null;
      }
    };
  }, []);

  // Initialize Tone.js context (must call on first user interaction)
  const initEngine = async (): Promise<void> => {
    if (engineRef.current && !engineRef.current.isInitialized()) {
      await engineRef.current.init();
    }
  };

  return {
    engine: engineRef.current,
    initEngine,
    ready, // Indicates engine is loaded
  };
}
