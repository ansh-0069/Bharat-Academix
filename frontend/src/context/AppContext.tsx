import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Language = 'hi' | 'ta' | 'bn' | 'en';
export type Mode = 'formal' | 'tuition-teacher';
export type Theme = 'light' | 'dark';

export interface HistoryEntry {
  id: string;
  question: string;
  answer: string;
  topicTag: string;
  language: Language;
  grade: number;
  timestamp: number;
  confidence: 'high' | 'medium' | 'low';
}

interface AppState {
  language: Language;
  setLanguage: (l: Language) => void;
  mode: Mode;
  setMode: (m: Mode) => void;
  lowBandwidth: boolean;
  setLowBandwidth: (v: boolean) => void;
  grade: number;
  setGrade: (g: number) => void;
  sessionId: string;
  theme: Theme;
  setTheme: (t: Theme) => void;
  history: HistoryEntry[];
  addHistory: (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  streak: number;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('hi');
  const [mode, setMode] = useState<Mode>('formal');
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [grade, setGrade] = useState<number>(8);
  const [theme, setThemeState] = useState<Theme>('light');
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [streak, setStreak] = useState(0);

  const [sessionId] = useState<string>(() => {
    const stored = localStorage.getItem('vs_session_id');
    if (stored) return stored;
    const newId = uuidv4();
    localStorage.setItem('vs_session_id', newId);
    return newId;
  });

  // Persist settings
  useEffect(() => {
    const saved = localStorage.getItem('vs_settings');
    if (saved) {
      try {
        const { language: l, mode: m, lowBandwidth: lb, grade: g, theme: t } = JSON.parse(saved);
        if (l) setLanguage(l);
        if (m) setMode(m);
        if (lb !== undefined) setLowBandwidth(lb);
        if (g !== undefined) setGrade(g);
        if (t) setThemeState(t);
      } catch {}
    }
    // Load history
    const savedHistory = localStorage.getItem('vs_history');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch {}
    }
    // Load streak
    const savedStreak = localStorage.getItem('vs_streak');
    if (savedStreak) {
      try {
        const { count, lastDate } = JSON.parse(savedStreak);
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        if (lastDate === today || lastDate === yesterday) {
          setStreak(count);
        } else {
          setStreak(0);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vs_settings', JSON.stringify({ language, mode, lowBandwidth, grade, theme }));
  }, [language, mode, lowBandwidth, grade, theme]);

  // Apply theme to document
  const setTheme = (t: Theme) => {
    setThemeState(t);
    document.documentElement.setAttribute('data-theme', t);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const addHistory = (entry: Omit<HistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: HistoryEntry = { ...entry, id: uuidv4(), timestamp: Date.now() };
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 50); // keep last 50
      localStorage.setItem('vs_history', JSON.stringify(updated));
      return updated;
    });
    // Update streak
    const today = new Date().toDateString();
    const savedStreak = localStorage.getItem('vs_streak');
    if (savedStreak) {
      try {
        const { count, lastDate } = JSON.parse(savedStreak);
        if (lastDate === today) {
          // already counted today
        } else {
          const yesterday = new Date(Date.now() - 86400000).toDateString();
          const newCount = lastDate === yesterday ? count + 1 : 1;
          setStreak(newCount);
          localStorage.setItem('vs_streak', JSON.stringify({ count: newCount, lastDate: today }));
        }
      } catch {
        setStreak(1);
        localStorage.setItem('vs_streak', JSON.stringify({ count: 1, lastDate: today }));
      }
    } else {
      setStreak(1);
      localStorage.setItem('vs_streak', JSON.stringify({ count: 1, lastDate: today }));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('vs_history');
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage, mode, setMode, lowBandwidth, setLowBandwidth,
      grade, setGrade, sessionId, theme, setTheme, history, addHistory, clearHistory, streak,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
