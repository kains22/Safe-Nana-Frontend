import { Routes, Route, Navigate } from 'react-router-dom'
import ElderlyInterface from './pages/ElderlyInterface'
import Dashboard from './pages/Dashboard'
import AlertsPage from './pages/AlertsPage'
import SettingsPage from './pages/SettingsPage'
import BillingPage from './pages/BillingPage'
import PrivacyPage from './pages/PrivacyPage'
import DashboardLayout from './components/DashboardLayout'

function App() {
  return (
    <Routes>
      {/* Redirect root to elderly interface */}
      <Route path="/" element={<Navigate to="/elderly" replace />} />

      {/* Elderly mobile interface */}
      <Route path="/elderly" element={<ElderlyInterface />} />

      {/* Family dashboard - wrapped in layout */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/alerts" element={<DashboardLayout />}>
        <Route index element={<AlertsPage />} />
      </Route>
      <Route path="/settings" element={<DashboardLayout />}>
        <Route index element={<SettingsPage />} />
      </Route>
      <Route path="/billing" element={<DashboardLayout />}>
        <Route index element={<BillingPage />} />
      </Route>
      <Route path="/privacy" element={<DashboardLayout />}>
        <Route index element={<PrivacyPage />} />
      </Route>

      {/* Unknown address: go to the start */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App