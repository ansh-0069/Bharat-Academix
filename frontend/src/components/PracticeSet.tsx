// PracticeSet.tsx — 5-question MCQ quiz with instant right/wrong feedback
import { useState } from 'react';
import { X, CheckCircle, XCircle, Trophy } from 'lucide-react';
import type { Question } from '../api/client';
import type { Language } from '../context/AppContext';

const LANG_CLASS: Record<Language, string> = {
  hi: 'lang-hi',
  ta: 'lang-ta',
  bn: 'lang-bn',
  en: '',
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
    if (answers[qIdx] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const allAnswered = Object.keys(answers).length === questions.length;
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct_index ? 1 : 0), 0);

  return (
    <div className="practice-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="practice-sheet" onClick={e => e.stopPropagation()} id="practice-sheet">
        <div className="practice-header">
          <div>
            <div className="practice-header-title">Practice Set — {topicTag}</div>
            <div className="practice-header-sub">
              {Object.keys(answers).length}/{questions.length} answered
            </div>
          </div>
          <button className="close-btn" id="practice-close-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

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
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      {answered && optIdx === q.correct_index && <CheckCircle size={14} color="#059669" />}
                      {answered && optIdx === chosen && optIdx !== q.correct_index && <XCircle size={14} color="#DC2626" />}
                      <span className={langClass}>{['A', 'B', 'C', 'D'][optIdx]}. {opt}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          );
        })}

        {allAnswered && (
          <div className="practice-score" id="practice-score">
            <Trophy size={32} style={{ margin: '0 auto 10px', opacity: 0.95 }} />
            <div className="practice-score-value">{score}/{questions.length}</div>
            <div className="practice-score-msg">
              {score === questions.length
                ? 'Perfect score — excellent work!'
                : score >= Math.ceil(questions.length * 0.6)
                  ? 'Good job — keep practicing!'
                  : 'Keep going — practice makes perfect!'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
