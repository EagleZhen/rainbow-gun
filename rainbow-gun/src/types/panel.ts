export interface PanelProps {
  knobValues: Record<string, number>;
  selectedKnob: string | null;
  onKnobSelect: (id: string) => void;
}
