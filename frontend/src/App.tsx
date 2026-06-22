// App.tsx — Premium shell with glass header + floating nav
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { Home as HomeIcon, BarChart2, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import Home from './pages/Home';
import Progress from './pages/Progress';
import Settings from './pages/Settings';

const NAV_ITEMS = [
  { path: '/', label: 'Ask', icon: HomeIcon, id: 'nav-home' },
  { path: '/progress', label: 'Progress', icon: BarChart2, id: 'nav-progress' },
  { path: '/settings', label: 'Settings', icon: SettingsIcon, id: 'nav-settings' },
];

export default function App() {
  return (
    <div className="app-shell">
      <header className="header">
        <div className="header-logo">
          <div className="header-logo-mark" aria-hidden="true">🪷</div>
          <div className="header-logo-text">
            <span className="header-logo-devanagari">विद्या सहायक</span>
            <span className="header-logo-english">Vidya Sahayak</span>
          </div>
        </div>
        <div className="header-badge">
          <Sparkles size={11} />
          CodeQuest 2026
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <nav className="bottom-nav" aria-label="Main navigation">
        {NAV_ITEMS.map(({ path, label, icon: Icon, id }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            id={id}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={20} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
