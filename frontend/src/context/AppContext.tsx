import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type Language = 'hi' | 'ta' | 'bn' | 'en';
export type Mode = 'formal' | 'tuition-teacher';

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
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('hi');
  const [mode, setMode] = useState<Mode>('formal');
  const [lowBandwidth, setLowBandwidth] = useState(false);
  const [grade, setGrade] = useState<number>(8);
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
        const { language: l, mode: m, lowBandwidth: lb, grade: g } = JSON.parse(saved);
        if (l) setLanguage(l);
        if (m) setMode(m);
        if (lb !== undefined) setLowBandwidth(lb);
        if (g !== undefined) setGrade(g);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('vs_settings', JSON.stringify({ language, mode, lowBandwidth, grade }));
  }, [language, mode, lowBandwidth, grade]);

  return (
    <AppContext.Provider value={{ language, setLanguage, mode, setMode, lowBandwidth, setLowBandwidth, grade, setGrade, sessionId }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
