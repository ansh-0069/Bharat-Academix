// WeakTopicCard.tsx
import { TrendingUp, ArrowRight, Loader2 } from 'lucide-react';

interface Props {
  topicTag: string;
  onGeneratePractice: () => void;
  isLoading: boolean;
}

export default function WeakTopicCard({ topicTag, onGeneratePractice, isLoading }: Props) {
  return (
    <div className="weak-topic-card" id="weak-topic-card">
      <div className="weak-topic-title">
        <TrendingUp size={16} />
        We noticed a pattern
      </div>
      <p className="weak-topic-desc">
        You've asked multiple questions about <strong>{topicTag}</strong>.
        Want a quick practice set to strengthen this topic?
      </p>
      <button
        id="generate-practice-btn"
        className="action-btn action-btn-saffron"
        onClick={onGeneratePractice}
        disabled={isLoading}
        style={{ width: '100%', justifyContent: 'center', padding: '12px 16px' }}
      >
        {isLoading ? (
          <>
            <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            Generating…
          </>
        ) : (
          <>
            Generate Practice Set
            <ArrowRight size={14} />
          </>
        )}
      </button>
    </div>
  );
}
