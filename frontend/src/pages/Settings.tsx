// Settings.tsx
import { Settings as SettingsIcon, Wifi, WifiOff, Globe, Info } from 'lucide-react';
import { useApp } from '../context/AppContext';

const LANGUAGES = [
  { code: 'hi' as const, script: 'हिं', name: 'Hindi', status: 'active' as const },
  { code: 'ta' as const, script: 'த', name: 'Tamil', status: 'active' as const },
  { code: 'bn' as const, script: 'বাং', name: 'Bengali', status: 'active' as const },
  { code: 'en' as const, script: 'En', name: 'English', status: 'active' as const },
];

const COMING_SOON = ['Gujarati', 'Marathi', 'Telugu', 'Kannada', 'Punjabi', 'Odia'];

export default function Settings() {
  const { lowBandwidth, setLowBandwidth, sessionId, language, setLanguage } = useApp();

  return (
    <div className="page-content">
      <header className="page-header">
        <div className="page-header-row">
          <div className="page-header-icon">
            <SettingsIcon size={18} />
          </div>
          <h1 className="page-title">Settings</h1>
        </div>
        <p className="page-subtitle">Customize your Vidya Sahayak experience</p>
      </header>

      <p className="section-title">Connectivity</p>
      <div className="settings-row" id="lowbw-settings-row">
        <div>
          <div className="settings-label">
            {lowBandwidth ? <WifiOff size={16} color="#D97706" /> : <Wifi size={16} color="#4F46E5" />}
            Low-Bandwidth Mode
          </div>
          <div className="settings-desc">
            {lowBandwidth
              ? 'On: short answers, manual audio tap to play'
              : 'Off: full answers, auto-plays audio'}
          </div>
        </div>
        <button
          id="lowbw-toggle"
          className={`toggle ${lowBandwidth ? 'on' : ''}`}
          onClick={() => setLowBandwidth(!lowBandwidth)}
          aria-label="Toggle low bandwidth mode"
        >
          <div className="toggle-knob" />
        </button>
      </div>

      <p className="section-title" style={{ marginTop: 24 }}>Language Packs</p>
      {LANGUAGES.map(lang => (
        <div key={lang.code} className="settings-row" id={`lang-settings-${lang.code}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span className="lang-icon-box">{lang.script}</span>
            <div>
              <div className="settings-label">{lang.name}</div>
              <div className="settings-desc">Active · STT + TTS + Gemini wired</div>
            </div>
          </div>
          <button
            className={`action-btn action-btn-green ${language === lang.code ? '' : ''}`}
            style={{ opacity: language === lang.code ? 1 : 0.85 }}
            onClick={() => setLanguage(lang.code)}
          >
            {language === lang.code ? 'Selected' : 'Use'}
          </button>
        </div>
      ))}

      <p className="section-title" style={{ marginTop: 20 }}>Coming Soon</p>
      <div className="coming-soon-grid">
        {COMING_SOON.map(lang => (
          <span key={lang} className="coming-soon-pill">{lang}</span>
        ))}
      </div>
      <div className="info-banner">
        <Globe size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Architecture is language-pack based — adding a new language is a config change, not a rebuild.</span>
      </div>

      <p className="section-title" style={{ marginTop: 24 }}>About</p>
      <div className="settings-row">
        <div>
          <div className="settings-label">विद्या सहायक — Vidya Sahayak</div>
          <div className="settings-desc">Bharat Academix CodeQuest 2026 · Round 2 MVP</div>
        </div>
        <Info size={18} color="#94A3B8" />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-label">Session ID</div>
          <div className="settings-desc" style={{ fontFamily: 'var(--font-mono)', fontSize: 10 }}>
            {sessionId.slice(0, 18)}…
          </div>
        </div>
      </div>

      <p className="footer-note">
        Powered by Google Gemini 1.5 Flash · Browser Web Speech API
      </p>
    </div>
  );
}
