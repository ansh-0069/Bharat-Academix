// Progress.tsx — Session topic frequency tracker with animated stats
import { useEffect, useState } from 'react';
import { TrendingUp, BarChart2, Loader2, AlertCircle, Award, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../api/client';
import type { ProgressTopic } from '../api/client';

function AnimatedRing({ value, max, color, size = 72 }: { value: number; max: number; color: string; size?: number }) {
  const radius = (size - 10) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? value / max : 0;
  const [animated, setAnimated] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(pct), 100);
    return () => clearTimeout(timer);
  }, [pct]);

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--bg-muted)"
        strokeWidth={8}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={circumference * (1 - animated)}
        style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
      />
    </svg>
  );
}

const TOPIC_COLORS = [
  '#4F46E5', '#7C3AED', '#059669', '#D97706', '#0284C7', '#DC2626',
  '#16A34A', '#9333EA', '#0891B2', '#CA8A04',
];

const TOPIC_EMOJIS: Record<string, string> = {
  photosynthesis: '🌿',
  'water-cycle': '💧',
  pythagoras: '📐',
  fractions: '½',
  'simple-circuit': '⚡',
  'digestive-system': '🫀',
  algebra: 'x²',
  motion: '🚀',
  atoms: '⚛️',
  cells: '🔬',
  geometry: '△',
  gravity: '🍎',
  light: '💡',
  sound: '🔊',
  magnetism: '🧲',
  force: '💪',
  general: '📚',
};

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
  const totalQuestions = topics.reduce((a, t) => a + t.count, 0);
  const strongTopics = topics.filter(t => t.count >= 3).length;
  const uniqueTopics = topics.length;

  // High confidence count from local history
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

      {/* Stats row */}
      {!isLoading && !error && topics.length > 0 && (
        <div className="progress-stats-row">
          <div className="progress-stat-card">
            <div className="progress-stat-ring">
              <AnimatedRing value={totalQuestions} max={Math.max(totalQuestions, 20)} color="#4F46E5" size={64} />
              <span className="progress-stat-ring-value">{totalQuestions}</span>
            </div>
            <div className="progress-stat-label">Questions</div>
          </div>
          <div className="progress-stat-card">
            <div className="progress-stat-ring">
              <AnimatedRing value={uniqueTopics} max={Math.max(uniqueTopics, 10)} color="#059669" size={64} />
              <span className="progress-stat-ring-value">{uniqueTopics}</span>
            </div>
            <div className="progress-stat-label">Topics</div>
          </div>
          <div className="progress-stat-card">
            <div className="progress-stat-ring">
              <AnimatedRing value={strongTopics} max={Math.max(uniqueTopics, 1)} color="#D97706" size={64} />
              <span className="progress-stat-ring-value">{strongTopics}</span>
            </div>
            <div className="progress-stat-label">Patterns</div>
          </div>
        </div>
      )}

      {/* Achievement badge */}
      {!isLoading && totalQuestions >= 5 && (
        <div className="achievement-card">
          <div className="achievement-icon">
            <Award size={20} />
          </div>
          <div>
            <div className="achievement-title">Active Learner</div>
            <div className="achievement-sub">You've asked {totalQuestions} questions this session — keep going!</div>
          </div>
        </div>
      )}

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

      {!isLoading && topics.length > 0 && (
        <>
          <p className="section-title" style={{ marginTop: 20 }}>Topic Breakdown</p>
          {topics.map((topic, i) => {
            const emoji = TOPIC_EMOJIS[topic.topic_tag] ?? '📚';
            const color = TOPIC_COLORS[i % TOPIC_COLORS.length];
            return (
              <div key={i} className="topic-row enhanced-topic-row" id={`topic-row-${i}`}>
                <div className="topic-row-emoji" style={{ background: color + '18', color }}>
                  {emoji}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                    <span className="topic-tag-pill" style={{ background: color + '18', color, borderColor: color + '30' }}>
                      {topic.topic_tag}
                    </span>
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
                      style={{
                        width: `${(topic.count / maxCount) * 100}%`,
                        background: topic.count >= 3
                          ? 'linear-gradient(90deg, #D97706 0%, #F59E0B 100%)'
                          : `linear-gradient(90deg, ${color} 0%, ${color}CC 100%)`,
                      }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, marginLeft: 16 }}>
                  <span className="topic-count" style={{ background: color }}>{topic.count}</span>
                  <span className="topic-count-label">doubts</span>
                </div>
              </div>
            );
          })}
        </>
      )}

      {!isLoading && topics.length > 0 && (
        <div className="tip-card">
          <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <Target size={14} style={{ flexShrink: 0, marginTop: 1 }} />
            <span>Topics with <strong>3+ doubts</strong> will show a practice set suggestion on the Home screen.</span>
          </div>
        </div>
      )}
    </div>
  );
}
