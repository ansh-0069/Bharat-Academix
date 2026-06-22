// Progress.tsx — Session topic frequency tracker
import { useEffect, useState } from 'react';
import { TrendingUp, BarChart2, Loader2 } from 'lucide-react';
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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <BarChart2 size={18} color="#1F6F50" />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A2E25' }}>Your Progress</h2>
      </div>
      <p style={{ fontSize: 13, color: '#5A7A6A', marginBottom: 16 }}>
        Topics you've explored this session
      </p>

      {isLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
          <Loader2 size={24} color="#1F6F50" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {error && (
        <div style={{ color: '#B91C1C', fontSize: 13, padding: 16 }}>
          ⚠️ {error} — Is the backend running?
        </div>
      )}

      {!isLoading && !error && topics.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📖</div>
          <div className="empty-state-text">
            Ask some questions on the Home screen<br />and your topic history will appear here!
          </div>
        </div>
      )}

      {!isLoading && topics.map((topic, i) => (
        <div key={i} className="topic-row" id={`topic-row-${i}`}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <span className="topic-tag-pill">{topic.topic_tag}</span>
              {topic.count >= 3 && (
                <span style={{
                  fontSize: 10, background: '#FFF4EC', color: '#FF6B00',
                  border: '1px solid #FFCFA0', borderRadius: 6, padding: '2px 7px', fontWeight: 600
                }}>
                  <TrendingUp size={9} style={{ display: 'inline', marginRight: 3 }} />
                  Pattern detected
                </span>
              )}
            </div>
            {/* Progress bar */}
            <div style={{ background: '#E8F5EF', borderRadius: 4, height: 6 }}>
              <div style={{
                width: `${(topic.count / maxCount) * 100}%`,
                background: topic.count >= 3 ? 'var(--saffron)' : 'var(--green-deep)',
                height: '100%',
                borderRadius: 4,
                transition: 'width 0.5s ease-out',
              }} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 12 }}>
            <span className="topic-count">{topic.count}</span>
            <span style={{ fontSize: 10, color: '#5A7A6A' }}>doubts</span>
          </div>
        </div>
      ))}

      {!isLoading && topics.length > 0 && (
        <div style={{
          marginTop: 16, padding: '12px 14px', background: '#E8F5EF',
          borderRadius: 10, fontSize: 12, color: '#1F6F50'
        }}>
          💡 Topics with <strong>3+ doubts</strong> will show a practice set suggestion on the Home screen.
        </div>
      )}
    </div>
  );
}
