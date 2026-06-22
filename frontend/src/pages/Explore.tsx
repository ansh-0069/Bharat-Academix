// Explore.tsx — Subject browser with topic cards and quick-ask shortcuts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, ChevronRight, Zap, BookOpen, FlaskConical, Calculator, Globe2, Atom, Leaf } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface Topic {
  label: string;
  labelHi: string;
  query: string;
  icon: string;
}

interface Subject {
  id: string;
  name: string;
  nameHi: string;
  icon: React.ComponentType<any>;
  color: string;
  bg: string;
  topics: Topic[];
}

const SUBJECTS: Subject[] = [
  {
    id: 'science',
    name: 'Science',
    nameHi: 'विज्ञान',
    icon: FlaskConical,
    color: '#059669',
    bg: '#ECFDF5',
    topics: [
      { label: 'Photosynthesis', labelHi: 'प्रकाश संश्लेषण', query: 'What is photosynthesis?', icon: '🌿' },
      { label: 'Water Cycle', labelHi: 'जल चक्र', query: 'Explain the water cycle', icon: '💧' },
      { label: 'Human Digestion', labelHi: 'पाचन तंत्र', query: 'How does the digestive system work?', icon: '🫀' },
      { label: 'Cell Structure', labelHi: 'कोशिका संरचना', query: 'What is a cell and its structure?', icon: '🔬' },
      { label: 'Electricity', labelHi: 'विद्युत', query: 'What is electric current and circuit?', icon: '⚡' },
      { label: 'Atoms', labelHi: 'परमाणु', query: 'What is an atom and molecule?', icon: '⚛️' },
    ],
  },
  {
    id: 'math',
    name: 'Mathematics',
    nameHi: 'गणित',
    icon: Calculator,
    color: '#4F46E5',
    bg: '#EEF2FF',
    topics: [
      { label: 'Fractions', labelHi: 'भिन्न', query: 'What are fractions and how to add them?', icon: '½' },
      { label: "Pythagoras", labelHi: 'पाइथागोरस', query: "Explain Pythagoras theorem with example", icon: '📐' },
      { label: 'Algebra', labelHi: 'बीजगणित', query: 'What is algebra and how to solve equations?', icon: 'x²' },
      { label: 'Geometry', labelHi: 'रेखागणित', query: 'What are the properties of triangles?', icon: '△' },
      { label: 'Percentages', labelHi: 'प्रतिशत', query: 'How to calculate percentage?', icon: '%' },
      { label: 'Integers', labelHi: 'पूर्णांक', query: 'What are integers and negative numbers?', icon: '±' },
    ],
  },
  {
    id: 'social',
    name: 'Social Studies',
    nameHi: 'सामाजिक अध्ययन',
    icon: Globe2,
    color: '#D97706',
    bg: '#FFFBEB',
    topics: [
      { label: 'Indian History', labelHi: 'भारतीय इतिहास', query: 'What were the causes of the 1857 revolt?', icon: '🏛️' },
      { label: 'Geography', labelHi: 'भूगोल', query: 'What are the major rivers of India?', icon: '🗺️' },
      { label: 'Constitution', labelHi: 'संविधान', query: 'What are the fundamental rights in Indian Constitution?', icon: '📜' },
      { label: 'Climate', labelHi: 'जलवायु', query: 'What is the difference between weather and climate?', icon: '🌤️' },
      { label: 'Independence', labelHi: 'स्वतंत्रता', query: 'How did India gain independence?', icon: '🇮🇳' },
      { label: 'Trade', labelHi: 'व्यापार', query: 'What is international trade and its importance?', icon: '🌐' },
    ],
  },
  {
    id: 'physics',
    name: 'Physics',
    nameHi: 'भौतिकी',
    icon: Atom,
    color: '#7C3AED',
    bg: '#F5F3FF',
    topics: [
      { label: 'Motion', labelHi: 'गति', query: 'What is Newton\'s first law of motion?', icon: '🚀' },
      { label: 'Force', labelHi: 'बल', query: 'What is force and its types?', icon: '💪' },
      { label: 'Light', labelHi: 'प्रकाश', query: 'What is reflection and refraction of light?', icon: '💡' },
      { label: 'Sound', labelHi: 'ध्वनि', query: 'What is sound and how does it travel?', icon: '🔊' },
      { label: 'Gravity', labelHi: 'गुरुत्व', query: 'What is gravity and gravitational force?', icon: '🍎' },
      { label: 'Magnetism', labelHi: 'चुंबकत्व', query: 'What are magnetic poles and their properties?', icon: '🧲' },
    ],
  },
  {
    id: 'english',
    name: 'English',
    nameHi: 'अंग्रेज़ी',
    icon: BookOpen,
    color: '#0284C7',
    bg: '#F0F9FF',
    topics: [
      { label: 'Grammar', labelHi: 'व्याकरण', query: 'Explain tenses in English grammar', icon: '📝' },
      { label: 'Parts of Speech', labelHi: 'शब्द भेद', query: 'What are the parts of speech with examples?', icon: '🔤' },
      { label: 'Comprehension', labelHi: 'बोधन', query: 'What is reading comprehension?', icon: '📖' },
      { label: 'Essay Writing', labelHi: 'निबंध', query: 'How to write a good essay?', icon: '✍️' },
      { label: 'Synonyms', labelHi: 'पर्यायवाची', query: 'What are synonyms and antonyms?', icon: '🔀' },
      { label: 'Punctuation', labelHi: 'विराम चिह्न', query: 'How to use punctuation marks correctly?', icon: ',' },
    ],
  },
  {
    id: 'environment',
    name: 'Environment',
    nameHi: 'पर्यावरण',
    icon: Leaf,
    color: '#16A34A',
    bg: '#F0FDF4',
    topics: [
      { label: 'Ecosystem', labelHi: 'पारिस्थितिकी', query: 'What is an ecosystem?', icon: '🌳' },
      { label: 'Pollution', labelHi: 'प्रदूषण', query: 'What are the types of pollution and their effects?', icon: '🌫️' },
      { label: 'Conservation', labelHi: 'संरक्षण', query: 'Why is forest conservation important?', icon: '♻️' },
      { label: 'Food Chain', labelHi: 'खाद्य श्रृंखला', query: 'What is a food chain and food web?', icon: '🦁' },
      { label: 'Climate Change', labelHi: 'जलवायु परिवर्तन', query: 'What is climate change and global warming?', icon: '🌡️' },
      { label: 'Biodiversity', labelHi: 'जैव विविधता', query: 'What is biodiversity and why is it important?', icon: '🦋' },
    ],
  },
];

const DAILY_CHALLENGES = [
  { question: 'How does a rainbow form?', emoji: '🌈', topic: 'Light' },
  { question: 'Why is the sky blue?', emoji: '☁️', topic: 'Physics' },
  { question: 'How do plants make food?', emoji: '🌿', topic: 'Photosynthesis' },
  { question: 'What causes earthquakes?', emoji: '🌍', topic: 'Geography' },
  { question: 'How does the heart pump blood?', emoji: '❤️', topic: 'Biology' },
];

function getDailyChallenge() {
  const dayOfYear = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return DAILY_CHALLENGES[dayOfYear % DAILY_CHALLENGES.length];
}

export default function Explore() {
  const [activeSubject, setActiveSubject] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { language: _lang } = useApp(); // eslint-disable-line

  const challenge = getDailyChallenge();

  const handleTopicClick = (query: string) => {
    // Store the query in sessionStorage so Home page can pick it up
    sessionStorage.setItem('vs_explore_query', query);
    navigate('/');
  };

  const filtered = SUBJECTS.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nameHi.includes(searchQuery) ||
    s.topics.some(t => t.label.toLowerCase().includes(searchQuery.toLowerCase()) || t.labelHi.includes(searchQuery))
  );

  const activeSubjectData = SUBJECTS.find(s => s.id === activeSubject);

  return (
    <div className="page-content">
      <header className="page-header">
        <div className="page-header-row">
          <div className="page-header-icon">
            <Compass size={18} />
          </div>
          <h1 className="page-title">Explore Topics</h1>
        </div>
        <p className="page-subtitle">Browse subjects and ask questions instantly</p>
      </header>

      {/* Daily Challenge */}
      <div className="daily-challenge-card" onClick={() => handleTopicClick(challenge.question)}>
        <div className="daily-challenge-top">
          <div className="daily-badge">
            <Zap size={11} />
            Daily Challenge
          </div>
          <span className="daily-topic-pill">{challenge.topic}</span>
        </div>
        <div className="daily-challenge-content">
          <span className="daily-challenge-emoji">{challenge.emoji}</span>
          <div>
            <div className="daily-challenge-q">{challenge.question}</div>
            <div className="daily-challenge-hint">Tap to ask Vidya Sahayak →</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="explore-search-wrap">
        <input
          className="explore-search"
          type="text"
          placeholder="Search subjects or topics…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Subject chips */}
      {!activeSubject && (
        <>
          <p className="section-title">All Subjects</p>
          <div className="subject-grid">
            {filtered.map(subject => {
              const Icon = subject.icon;
              return (
                <button
                  key={subject.id}
                  className="subject-card"
                  style={{ '--subject-color': subject.color, '--subject-bg': subject.bg } as React.CSSProperties}
                  onClick={() => setActiveSubject(subject.id)}
                >
                  <div className="subject-card-icon">
                    <Icon size={22} />
                  </div>
                  <div className="subject-card-text">
                    <div className="subject-card-name">{subject.name}</div>
                    <div className="subject-card-namehi">{subject.nameHi}</div>
                  </div>
                  <ChevronRight size={16} className="subject-card-arrow" />
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && (
            <div className="empty-state">
              <div className="empty-state-icon">🔍</div>
              <div className="empty-state-text">No subjects found for "{searchQuery}"</div>
            </div>
          )}
        </>
      )}

      {/* Topic list for selected subject */}
      {activeSubject && activeSubjectData && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <button
              className="back-btn"
              onClick={() => setActiveSubject(null)}
            >
              ← Back
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div
                className="subject-icon-sm"
                style={{ background: activeSubjectData.bg, color: activeSubjectData.color }}
              >
                <activeSubjectData.icon size={16} />
              </div>
              <span className="page-title" style={{ fontSize: 18 }}>{activeSubjectData.name}</span>
            </div>
          </div>

          <p className="section-title">Quick Ask — tap any topic</p>
          <div className="topic-grid">
            {activeSubjectData.topics.map((topic, i) => (
              <button
                key={i}
                className="topic-chip"
                style={{ '--subject-color': activeSubjectData.color, '--subject-bg': activeSubjectData.bg } as React.CSSProperties}
                onClick={() => handleTopicClick(topic.query)}
              >
                <span className="topic-chip-emoji">{topic.icon}</span>
                <div className="topic-chip-text">
                  <div className="topic-chip-label">{topic.label}</div>
                  <div className="topic-chip-labelhi">{topic.labelHi}</div>
                </div>
                <ChevronRight size={14} style={{ color: activeSubjectData.color, opacity: 0.6, marginLeft: 'auto', flexShrink: 0 }} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
