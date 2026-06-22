// PracticeSet.tsx — 5-question MCQ quiz with instant right/wrong feedback
import { useState } from 'react';
import { X, CheckCircle, XCircle, Trophy } from 'lucide-react';
import type { Question } from '../api/client';
import type { Language } from '../context/AppContext';

const LANG_CLASS: Record<Language, string> = {
  hi: 'lang-hi',
  ta: 'lang-ta',
  bn: 'lang-bn',
};

interface Props {
  questions: Question[];
  topicTag: string;
  language: Language;
  onClose: () => void;
}

export default function PracticeSet({ questions, topicTag, language, onClose }: Props) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const langClass = LANG_CLASS[language];

  const handleAnswer = (qIdx: number, optIdx: number) => {
    if (answers[qIdx] !== undefined) return; // already answered
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const allAnswered = Object.keys(answers).length === questions.length;
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct_index ? 1 : 0), 0);

  return (
    <div className="practice-overlay" onClick={onClose}>
      <div className="practice-sheet" onClick={e => e.stopPropagation()} id="practice-sheet">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1A2E25' }}>
              Practice Set — {topicTag}
            </div>
            <div style={{ fontSize: 12, color: '#5A7A6A', marginTop: 2 }}>
              {Object.keys(answers).length}/{questions.length} answered
            </div>
          </div>
          <button className="close-btn" id="practice-close-btn" onClick={onClose}>
            <X size={18} color="#374151" />
          </button>
        </div>

        {/* Questions */}
        {questions.map((q, qIdx) => {
          const chosen = answers[qIdx];
          const answered = chosen !== undefined;

          return (
            <div key={qIdx} className="practice-question" id={`practice-q-${qIdx}`}>
              <div className={`practice-q-text ${langClass}`}>
                {qIdx + 1}. {q.question}
              </div>
              {q.options.map((opt, optIdx) => {
                let className = 'practice-option';
                if (answered) {
                  if (optIdx === q.correct_index) className += ' correct';
                  else if (optIdx === chosen) className += ' incorrect';
                }
                return (
                  <button
                    key={optIdx}
                    id={`practice-q${qIdx}-opt${optIdx}`}
                    className={className}
                    onClick={() => handleAnswer(qIdx, optIdx)}
                    disabled={answered}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {answered && optIdx === q.correct_index && <CheckCircle size={13} color="#15803D" />}
                      {answered && optIdx === chosen && optIdx !== q.correct_index && <XCircle size={13} color="#B91C1C" />}
                      <span className={langClass}>{['A', 'B', 'C', 'D'][optIdx]}. {opt}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}

        {/* Score display */}
        {allAnswered && (
          <div className="practice-score" id="practice-score">
            <Trophy size={28} color="#F5A623" style={{ margin: '0 auto 8px' }} />
            <div style={{ fontSize: 20, fontWeight: 800 }}>
              {score}/{questions.length}
            </div>
            <div style={{ fontSize: 14, marginTop: 4, opacity: 0.9 }}>
              {score === questions.length
                ? '🎉 Perfect! Excellent work!'
                : score >= Math.ceil(questions.length * 0.6)
                  ? '👍 Good job! Keep practicing!'
                  : '💪 Keep going — practice makes perfect!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
