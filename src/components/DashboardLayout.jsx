import { NavLink, Link, Outlet } from 'react-router-dom'
import './DashboardLayout.css'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: '🏠' },
  { to: '/alerts', label: 'Alerts', icon: '🔔' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
  { to: '/billing', label: 'Billing', icon: '💳' },
]

export default function DashboardLayout() {
  return (
    <div className="layout">
      <div
        role="note"
        style={{
          background: '#fff4d6',
          color: '#5c4400',
          textAlign: 'center',
          padding: '8px 12px',
          fontSize: '0.9rem',
          borderBottom: '1px solid #e6c875'
        }}
      >
        <strong>Prototype / pilot version.</strong> Not for emergency use. Do not enter real personal data.
      </div>
      <header className="layout-header">
        <div className="layout-header-inner">
          <Link to="/dashboard" className="logo">
            <span className="logo-leaf">🌿</span>
            <span className="logo-text">SafeNana</span>
          </Link>
          <nav className="layout-nav" aria-label="Main navigation">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/dashboard'}
                className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
              >
                <span className="nav-icon">{icon}</span>
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <a href="/elderly" className="header-badge" target="_blank" rel="noopener noreferrer">
            <span>👴</span> Elderly View
          </a>
        </div>
      </header>
      <main className="layout-main">
        <Outlet />
      </main>
      <footer className="layout-footer">
        <p>
          SafeNana © 2026 — Prototype version ·{' '}
          <Link to="/privacy">Privacy</Link>
        </p>
      </footer>
    </div>
  )
}