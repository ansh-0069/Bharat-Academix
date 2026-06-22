// DiagramViewer.tsx — Routes topic_tag to the matching SVG component
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { useState } from 'react';
import PhotosynthesisDiagram from './diagrams/PhotosynthesisDiagram';
import WaterCycleDiagram from './diagrams/WaterCycleDiagram';
import PythagorasDiagram from './diagrams/PythagorasDiagram';
import FractionsDiagram from './diagrams/FractionsDiagram';
import SimpleCircuitDiagram from './diagrams/SimpleCircuitDiagram';
import DigestiveSystemDiagram from './diagrams/DigestiveSystemDiagram';

const DIAGRAM_MAP: Record<string, { component: React.FC; title: string }> = {
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
}

export default function DiagramViewer({ topicTag, onClose }: Props) {
  const [scale, setScale] = useState(1);
  const entry = DIAGRAM_MAP[topicTag];

  if (!entry) return null;
  const Diagram = entry.component;

  return (
    <div className="diagram-overlay" onClick={onClose}>
      <div className="diagram-sheet" onClick={e => e.stopPropagation()}>
        <div className="diagram-sheet-header">
          <span className="diagram-title">{entry.title}</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="close-btn" onClick={() => setScale(s => Math.min(s + 0.2, 2))}>
              <ZoomIn size={16} color="#374151" />
            </button>
            <button className="close-btn" onClick={() => setScale(s => Math.max(s - 0.2, 0.6))}>
              <ZoomOut size={16} color="#374151" />
            </button>
            <button className="close-btn" id="diagram-close-btn" onClick={onClose}>
              <X size={18} color="#374151" />
            </button>
          </div>
        </div>
        <div className="diagram-svg-container" style={{ overflowX: 'auto' }}>
          <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', transition: 'transform 0.2s' }}>
            <Diagram />
          </div>
        </div>
        <p style={{ fontSize: 11, color: '#5A7A6A', marginTop: 8, textAlign: 'center' }}>
          Tap outside or ✕ to close · Use +/− to zoom
        </p>
      </div>
    </div>
  );
}
