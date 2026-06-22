// History.tsx — Session history with expandable Q&A entries
import { useState } from 'react';
import { Clock, ChevronDown, ChevronUp, Trash2, BookOpen, ShieldCheck, Shield, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { HistoryEntry } from '../context/AppContext';

const CONFIDENCE_CONFIG = {
  high: { icon: ShieldCheck, color: '#059669', bg: '#ECFDF5', label: 'High' },
  medium: { icon: Shield, color: '#D97706', bg: '#FFFBEB', label: 'Medium' },
  low: { icon: ShieldAlert, color: '#DC2626', bg: '#FEF2F2', label: 'Low' },
};

const LANG_CLASS: Record<string, string> = {
  hi: 'lang-hi',
  ta: 'lang-ta',
  bn: 'lang-bn',
  en: '',
};

function HistoryItem({ entry, isExpanded, onToggle }: {
  entry: HistoryEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const conf = CONFIDENCE_CONFIG[entry.confidence] ?? CONFIDENCE_CONFIG.medium;
  const ConfIcon = conf.icon;
  const timeAgo = getTimeAgo(entry.timestamp);

  return (
    <div className={`history-item ${isExpanded ? 'expanded' : ''}`}>
      <button className="history-item-header" onClick={onToggle}>
        <div className="history-item-meta">
          <span className="history-topic-pill">{entry.topicTag}</span>
          <span className="history-time">{timeAgo}</span>
        </div>
        <div className="history-question-row">
          <span className="history-question">{entry.question}</span>
          {isExpanded ? <ChevronUp size={16} style={{ flexShrink: 0, color: 'var(--text-tertiary)' }} /> : <ChevronDown size={16} style={{ flexShrink: 0, color: 'var(--text-tertiary)' }} />}
        </div>
        <div className="history-item-badges">
          <span className="history-grade-badge">Class {entry.grade}</span>
          <span className="history-conf-badge" style={{ background: conf.bg, color: conf.color }}>
            <ConfIcon size={10} />
            {conf.label}
          </span>
          <span className="history-lang-badge">{entry.language.toUpperCase()}</span>
        </div>
      </button>

      {isExpanded && (
        <div className="history-answer-body">
          <div className="history-answer-label">
            <BookOpen size={12} />
            Answer
          </div>
          <div className={`history-answer-text ${LANG_CLASS[entry.language] || ''}`}>
            {entry.answer}
          </div>
        </div>
      )}
    </div>
  );
}

function getTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function History() {
  const { history, clearHistory } = useApp();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filtered = history.filter(e =>
    e.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.topicTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group by date
  const grouped: { date: string; entries: HistoryEntry[] }[] = [];
  filtered.forEach(entry => {
    const dateStr = new Date(entry.timestamp).toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' });
    const existing = grouped.find(g => g.date === dateStr);
    if (existing) existing.entries.push(entry);
    else grouped.push({ date: dateStr, entries: [entry] });
  });

  const topTopics = history.reduce((acc, e) => {
    acc[e.topicTag] = (acc[e.topicTag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const topTopic = Object.entries(topTopics).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="page-content">
      <header className="page-header">
        <div className="page-header-row">
          <div className="page-header-icon">
            <Clock size={18} />
          </div>
          <h1 className="page-title">History</h1>
        </div>
        <p className="page-subtitle">All your questions from this device</p>
      </header>

      {history.length > 0 && (
        <div className="history-stats-row">
          <div className="history-stat-card">
            <div className="history-stat-value">{history.length}</div>
            <div className="history-stat-label">Total Questions</div>
          </div>
          {topTopic && (
            <div className="history-stat-card">
              <div className="history-stat-value" style={{ fontSize: 14 }}>{topTopic[0]}</div>
              <div className="history-stat-label">Top Topic ({topTopic[1]}×)</div>
            </div>
          )}
          <div className="history-stat-card">
            <div className="history-stat-value">{new Set(history.map(e => e.topicTag)).size}</div>
            <div className="history-stat-label">Topics Covered</div>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div className="explore-search-wrap">
          <input
            className="explore-search"
            type="text"
            placeholder="Search questions, topics…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      )}

      {history.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <div className="empty-state-text">
            No history yet.<br />
            Start asking questions on the Home screen!
          </div>
        </div>
      )}

      {filtered.length === 0 && searchQuery && (
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <div className="empty-state-text">No results for "{searchQuery}"</div>
        </div>
      )}

      {grouped.map(group => (
        <div key={group.date}>
          <p className="section-title" style={{ marginTop: 16 }}>{group.date}</p>
          {group.entries.map(entry => (
            <HistoryItem
              key={entry.id}
              entry={entry}
              isExpanded={expandedId === entry.id}
              onToggle={() => setExpandedId(prev => prev === entry.id ? null : entry.id)}
            />
          ))}
        </div>
      ))}

      {history.length > 0 && !showClearConfirm && (
        <button
          className="clear-history-btn"
          onClick={() => setShowClearConfirm(true)}
        >
          <Trash2 size={14} />
          Clear All History
        </button>
      )}

      {showClearConfirm && (
        <div className="clear-confirm-box">
          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
            Delete all {history.length} history entries?
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="action-btn action-btn-saffron" style={{ flex: 1, justifyContent: 'center' }} onClick={() => { clearHistory(); setShowClearConfirm(false); }}>
              Yes, Clear
            </button>
            <button className="action-btn action-btn-green" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setShowClearConfirm(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
