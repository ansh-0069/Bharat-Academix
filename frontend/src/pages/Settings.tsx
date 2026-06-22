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
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <SettingsIcon size={18} color="#1F6F50" />
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A2E25' }}>Settings</h2>
      </div>
      <p style={{ fontSize: 13, color: '#5A7A6A', marginBottom: 20 }}>
        Customize your Vidya Sahayak experience
      </p>

      {/* Low bandwidth toggle */}
      <p className="section-title">Connectivity</p>
      <div className="settings-row" id="lowbw-settings-row">
        <div>
          <div className="settings-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {lowBandwidth ? <WifiOff size={15} color="#FF6B00" /> : <Wifi size={15} color="#1F6F50" />}
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

      {/* Language packs */}
      <p className="section-title" style={{ marginTop: 20 }}>Language Packs</p>
      {LANGUAGES.map(lang => (
        <div key={lang.code} className="settings-row" id={`lang-settings-${lang.code}`}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 36, height: 36, borderRadius: 8, background: '#E8F5EF',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: '#1F6F50',
              fontFamily: 'Noto Sans Devanagari, Noto Sans Tamil, Noto Sans Bengali, sans-serif'
            }}>
              {lang.script}
            </span>
            <div>
              <div className="settings-label">{lang.name}</div>
              <div className="settings-desc">✅ Active · STT + TTS + Gemini wired</div>
            </div>
          </div>
          <button
            className={`action-btn ${language === lang.code ? 'action-btn-green' : ''}`}
            style={{ borderColor: language === lang.code ? '#1F6F50' : '#D4E8DC', fontSize: 11 }}
            onClick={() => setLanguage(lang.code)}
          >
            {language === lang.code ? 'Selected' : 'Use'}
          </button>
        </div>
      ))}

      {/* Coming soon */}
      <p className="section-title" style={{ marginTop: 16 }}>Coming Soon</p>
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16
      }}>
        {COMING_SOON.map(lang => (
          <span key={lang} style={{
            padding: '6px 12px', background: '#F3F4F6', color: '#9CA3AF',
            borderRadius: 8, fontSize: 12, fontWeight: 500,
            border: '1px solid #E5E7EB'
          }}>
            {lang}
          </span>
        ))}
      </div>
      <div style={{
        padding: '10px 12px', background: '#E8F5EF', borderRadius: 8,
        fontSize: 12, color: '#1F6F50', display: 'flex', gap: 6
      }}>
        <Globe size={14} style={{ flexShrink: 0, marginTop: 1 }} />
        <span>Architecture is language-pack based — adding a new language is a config change, not a rebuild.</span>
      </div>

      {/* About */}
      <p className="section-title" style={{ marginTop: 20 }}>About</p>
      <div className="settings-row">
        <div>
          <div className="settings-label">विद्या सहायक — Vidya Sahayak</div>
          <div className="settings-desc">Bharat Academix CodeQuest 2026 · Round 2 MVP</div>
        </div>
        <Info size={18} color="#5A7A6A" />
      </div>
      <div className="settings-row">
        <div>
          <div className="settings-label">Session ID</div>
          <div className="settings-desc" style={{ fontFamily: 'monospace', fontSize: 10 }}>
            {sessionId.slice(0, 18)}…
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 0', textAlign: 'center', fontSize: 11, color: '#9CA3AF' }}>
        Powered by Google Gemini 1.5 Flash · Browser Web Speech API
      </div>
    </div>
  );
}
