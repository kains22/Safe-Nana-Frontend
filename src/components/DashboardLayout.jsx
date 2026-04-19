import { NavLink, Outlet, useLocation } from 'react-router-dom'
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
      <header className="layout-header">
        <div className="layout-header-inner">
          <a href="/dashboard" className="logo">
            <span className="logo-leaf">🌿</span>
            <span className="logo-text">SafeNana</span>
          </a>
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
        <p>SafeNana © 2026 — Keeping families connected with care 💚</p>
      </footer>
    </div>
  )
}
