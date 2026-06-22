// AnswerCard.tsx
import { Volume2, VolumeX, BookOpen, Tag, RefreshCw } from 'lucide-react';
import ConfidenceBadge from './ConfidenceBadge';
import type { AskResponse } from '../api/client';
import type { Language, Mode } from '../context/AppContext';

const LANG_CLASS: Record<Language, string> = {
  hi: 'lang-hi',
  ta: 'lang-ta',
  bn: 'lang-bn',
};

interface Props {
  answer: AskResponse;
  language: Language;
  currentMode: Mode;
  grade: number;
  isSpeaking: boolean;
  onSpeak: () => void;
  onStop: () => void;
  onViewDiagram: () => void;
  onReExplain: (newMode: Mode) => void;
  lowBandwidth: boolean;
  isReExplaining?: boolean;
}

export default function AnswerCard({
  answer,
  language,
  currentMode,
  grade,
  isSpeaking,
  onSpeak,
  onStop,
  onViewDiagram,
  onReExplain,
  lowBandwidth,
  isReExplaining = false,
}: Props) {
  const langClass = LANG_CLASS[language];
  const otherMode: Mode = currentMode === 'formal' ? 'tuition-teacher' : 'formal';
  const otherModeLabel = currentMode === 'formal' ? '🏏 Tuition Style' : '📖 Formal';

  return (
    <div className="answer-card" id="answer-card">
      <div className="answer-header">
        <span className="answer-label">
          <BookOpen size={11} style={{ display: 'inline', marginRight: 4 }} />
          Answer
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
          <span className="grade-badge">Class {grade}</span>
          <span style={{ fontSize: 10, color: '#5A7A6A', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Tag size={10} />
            {answer.topic_tag}
          </span>
        </div>
      </div>

      <div className={`answer-body ${langClass}`} id="answer-text">
        {answer.answer}
      </div>

      {answer.confidence === 'low' && (
        <div style={{
          padding: '10px 16px',
          background: '#FEF2F2',
          fontSize: 12,
          color: '#B91C1C',
          fontWeight: 500,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}>
          ⚠️ Please verify this with your teacher
        </div>
      )}

      <div className="answer-footer" style={{ flexWrap: 'wrap', gap: 8 }}>
        <ConfidenceBadge confidence={answer.confidence as 'high' | 'medium' | 'low'} />

        {/* Audio control */}
        {!lowBandwidth ? (
          <button
            id="audio-play-btn"
            className={`audio-btn ${isSpeaking ? 'playing' : ''}`}
            onClick={isSpeaking ? onStop : onSpeak}
          >
            {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
            {isSpeaking ? 'Stop' : 'Play'}
          </button>
        ) : (
          <button
            id="audio-play-btn-lowbw"
            className="audio-btn"
            onClick={isSpeaking ? onStop : onSpeak}
          >
            <Volume2 size={13} />
            Tap to play
          </button>
        )}

        {/* Diagram button */}
        {answer.diagram_eligible && (
          <button
            id="view-diagram-btn"
            className="action-btn action-btn-green"
            onClick={onViewDiagram}
          >
            📐 View Diagram
          </button>
        )}

        {/* ── Re-explain button ── */}
        <button
          id="reexplain-btn"
          className={`reexplain-btn ${isReExplaining ? 'loading' : ''}`}
          onClick={() => !isReExplaining && onReExplain(otherMode)}
          title={`Re-explain in ${otherMode} style`}
        >
          <RefreshCw size={11} style={isReExplaining ? { animation: 'spin 1s linear infinite' } : {}} />
          {otherModeLabel}
        </button>
      </div>
    </div>
  );
}
