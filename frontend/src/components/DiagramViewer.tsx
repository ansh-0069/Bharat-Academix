// DiagramViewer.tsx — Routes topic_tag to the matching SVG component
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import type { ComponentType } from 'react';
import PhotosynthesisDiagram from './diagrams/PhotosynthesisDiagram';
import WaterCycleDiagram from './diagrams/WaterCycleDiagram';
import PythagorasDiagram from './diagrams/PythagorasDiagram';
import FractionsDiagram from './diagrams/FractionsDiagram';
import SimpleCircuitDiagram from './diagrams/SimpleCircuitDiagram';
import DigestiveSystemDiagram from './diagrams/DigestiveSystemDiagram';

const DIAGRAM_MAP: Record<string, { component: ComponentType<any>; title: string }> = {
  'photosynthesis': { component: PhotosynthesisDiagram, title: 'Photosynthesis' },
  'water-cycle': { component: WaterCycleDiagram, title: 'Water Cycle' },
  'pythagoras': { component: PythagorasDiagram, title: "Pythagoras' Theorem" },
  'fractions': { component: FractionsDiagram, title: 'Fractions' },
  'simple-circuit': { component: SimpleCircuitDiagram, title: 'Simple Electric Circuit' },
  'digestive-system': { component: DigestiveSystemDiagram, title: 'Human Digestive System' },
};

interface Props {
  topicTag: string;
  onClose: () => void;
  diagramData?: Record<string, number> | null;
}

export default function DiagramViewer({ topicTag, onClose, diagramData }: Props) {
  const [scale, setScale] = useState(1);
  const entry = DIAGRAM_MAP[topicTag];

  if (!entry) return null;
  const Diagram = entry.component;
  const diagramProps =
    topicTag === 'fractions'
      ? { numerator: diagramData?.numerator, denominator: diagramData?.denominator }
      : topicTag === 'pythagoras'
        ? { sideA: diagramData?.side_a, sideB: diagramData?.side_b, hypotenuse: diagramData?.hypotenuse }
        : undefined;

  return (
    <div className="diagram-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="diagram-sheet" onClick={e => e.stopPropagation()}>
        <div className="diagram-sheet-header">
          <span className="diagram-title">{entry.title}</span>
          <div className="sheet-actions">
            <button className="close-btn" onClick={() => setScale(s => Math.min(s + 0.2, 2))} aria-label="Zoom in">
              <ZoomIn size={16} />
            </button>
            <button className="close-btn" onClick={() => setScale(s => Math.max(s - 0.2, 0.6))} aria-label="Zoom out">
              <ZoomOut size={16} />
            </button>
            <button className="close-btn" id="diagram-close-btn" onClick={onClose} aria-label="Close">
              <X size={18} />
            </button>
          </div>
        </div>
        <div className="diagram-svg-container" style={{ overflowX: 'auto' }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.25s var(--ease-out)' }}>
            <Diagram {...diagramProps} />
          </div>
        </div>
        <p className="sheet-hint">Tap outside or close to dismiss · Use +/− to zoom</p>
      </div>
    </div>
  );
}
