/**
 * Props for panel components that display and control knobs.
 *
 * @example
 * <EffectsPanel
 *   knobValues={{ master: 0.8, pitch: 0.5 }}
 *   selectedKnob="master"
 * />
 */
export interface PanelProps {
  /** Knob values in 0-1 range, e.g., { master: 0.8, pitch: 0.5 } */
  knobValues: Record<string, number>;

  /** Currently selected knob ID during drag or MIDI input, or null */
  selectedKnob: string | null;
}
