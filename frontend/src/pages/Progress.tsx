// Progress.tsx — Session topic frequency tracker
import { useEffect, useState } from 'react';
import { TrendingUp, BarChart2, Loader2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import type { ProgressTopic } from '../api/client';

export default function Progress() {
  const { sessionId } = useApp();
  const [topics, setTopics] = useState<ProgressTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    api.progress(sessionId)
      .then(res => setTopics(res.topics))
      .catch(e => setError(e.message || 'Could not load progress'))
      .finally(() => setIsLoading(false));
  }, [sessionId]);

  const maxCount = Math.max(...topics.map(t => t.count), 1);

  return (
    <div className="page-content">
      <header className="page-header">
        <div className="page-header-row">
          <div className="page-header-icon">
            <BarChart2 size={18} />
          </div>
          <h1 className="page-title">Your Progress</h1>
        </div>
        <p className="page-subtitle">Topics you've explored this session</p>
      </header>

      {isLoading && (
        <div className="loading-center">
          <Loader2 size={28} style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          <AlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          {error} — Is the backend running?
        </div>
      )}

      {!isLoading && !error && topics.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <div className="empty-state-text">
            Ask some questions on the Home screen<br />and your topic history will appear here.
          </div>
        </div>
      )}

      {!isLoading && topics.map((topic, i) => (
        <div key={i} className="topic-row" id={`topic-row-${i}`}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
              <span className="topic-tag-pill">{topic.topic_tag}</span>
              {topic.count >= 3 && (
                <span className="pattern-badge">
                  <TrendingUp size={10} />
                  Pattern detected
                </span>
              )}
            </div>
            <div className="progress-bar-track">
              <div
                className={`progress-bar-fill ${topic.count >= 3 ? 'highlight' : 'default'}`}
                style={{ width: `${(topic.count / maxCount) * 100}%` }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginLeft: 16 }}>
            <span className="topic-count">{topic.count}</span>
            <span className="topic-count-label">doubts</span>
          </div>
        </div>
      ))}

      {!isLoading && topics.length > 0 && (
        <div className="tip-card">
          Topics with <strong>3+ doubts</strong> will show a practice set suggestion on the Home screen.
        </div>
      )}
    </div>
  );
}
