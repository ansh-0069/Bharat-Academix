// App.tsx — Shell with header + bottom nav + routing
import { NavLink, Routes, Route, Navigate } from 'react-router-dom';
import { Home as HomeIcon, BarChart2, Settings as SettingsIcon } from 'lucide-react';
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
      {/* Header */}
      <header className="header">
        <div className="header-logo">
          {/* Small lotus icon */}
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="rgba(255,255,255,0.15)" />
            <text x="16" y="22" textAnchor="middle" fontSize="18">🪷</text>
          </svg>
          <div className="header-logo-text">
            <span className="header-logo-devanagari">विद्या सहायक</span>
            <span className="header-logo-english">Vidya Sahayak</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: 6,
            padding: '3px 8px',
            fontSize: 10,
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 600,
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            🏆 CodeQuest 2026
          </div>
        </div>
      </header>

      {/* Page content */}
      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        {NAV_ITEMS.map(({ path, label, icon: Icon, id }) => (
          <NavLink
            key={path}
            to={path}
            end={path === '/'}
            id={id}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={22} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
