// App.tsx — Premium shell with glass header + floating nav
import { NavLink, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Home as HomeIcon, BarChart2, Settings as SettingsIcon, Sparkles, Compass, Clock } from 'lucide-react';
import Home from './pages/Home';
import Progress from './pages/Progress';
import Settings from './pages/Settings';
import Explore from './pages/Explore';
import History from './pages/History';
import { useApp } from './context/AppContext';

const NAV_ITEMS = [
  { path: '/', label: 'Ask', icon: HomeIcon, id: 'nav-home' },
  { path: '/explore', label: 'Explore', icon: Compass, id: 'nav-explore' },
  { path: '/history', label: 'History', icon: Clock, id: 'nav-history' },
  { path: '/progress', label: 'Progress', icon: BarChart2, id: 'nav-progress' },
  { path: '/settings', label: 'Settings', icon: SettingsIcon, id: 'nav-settings' },
];

function PageTransitionWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      {children}
    </div>
  );
}

export default function App() {
  const { streak } = useApp();

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {streak > 0 && (
            <div className="streak-badge" title={`${streak} day streak`}>
              🔥 {streak}
            </div>
          )}
          <div className="header-badge">
            <Sparkles size={11} />
            CodeQuest 2026
          </div>
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <PageTransitionWrapper>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/history" element={<History />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </PageTransitionWrapper>
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
            <Icon size={18} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
