import { useState, useEffect } from 'react'
import { getAlerts } from '../services/api'
import { mockEvents } from '../services/mockData'
import './AlertsPage.css'

const SENDER_LABELS = {
  unknown_number: { label: 'Unknown Number', icon: '📵', color: 'red' },
  whatsapp_forward: { label: 'WhatsApp Forward', icon: '💬', color: 'amber' },
  someone_i_know: { label: 'Someone They Know', icon: '🧑', color: 'blue' }
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    getAlerts()
      .then(res => setAlerts(res.data))
      .catch(() => setAlerts(mockEvents.filter(e => e.type === 'suspicious_message')))
      .finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.senderType === filter)

  return (
    <div className="alerts-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔔 Suspicious Message Alerts</h1>
          <p className="page-subtitle">All scam and fraud attempts flagged by {alerts[0]?.elderlyName || 'Nana'}</p>
        </div>
        <div className="alerts-count-badge">
          {alerts.length} total alerts
        </div>
      </div>

      {/* Summary banner */}
      <div className="alerts-summary-banner">
        <div className="alert-summary-stat">
          <span className="alert-summary-num">{alerts.length}</span>
          <span className="alert-summary-label">Total Alerts</span>
        </div>
        <div className="alert-summary-divider" />
        <div className="alert-summary-stat">
          <span className="alert-summary-num">{alerts.filter(a => a.senderType === 'unknown_number').length}</span>
          <span className="alert-summary-label">Unknown Numbers</span>
        </div>
        <div className="alert-summary-divider" />
        <div className="alert-summary-stat">
          <span className="alert-summary-num">{alerts.filter(a => a.senderType === 'whatsapp_forward').length}</span>
          <span className="alert-summary-label">WhatsApp Forwards</span>
        </div>
        <div className="alert-summary-divider" />
        <div className="alert-summary-stat">
          <span className="alert-summary-num">{alerts.filter(a => a.senderType === 'someone_i_know').length}</span>
          <span className="alert-summary-label">Known Contacts</span>
        </div>
      </div>

      {/* Filter pills */}
      <div className="filter-pills">
        {[
          { key: 'all', label: 'All Alerts', icon: '🔔' },
          { key: 'unknown_number', label: 'Unknown Number', icon: '📵' },
          { key: 'whatsapp_forward', label: 'WhatsApp Forward', icon: '💬' },
          { key: 'someone_i_know', label: 'Known Contact', icon: '🧑' },
        ].map(f => (
          <button
            key={f.key}
            id={`filter-${f.key}`}
            className={`filter-pill ${filter === f.key ? 'filter-pill--active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>

      {/* Alerts list */}
      {loading ? (
        <div className="loading-skeleton">
          {[1,2,3].map(i => <div key={i} className="skeleton-item" style={{ height: 100 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="alerts-empty">
          <span className="alerts-empty-icon">🛡️</span>
          <h3>No alerts in this category</h3>
          <p>All clear! No suspicious messages of this type have been reported.</p>
        </div>
      ) : (
        <div className="alerts-list">
          {filtered.map((alert, idx) => {
            const senderInfo = SENDER_LABELS[alert.senderType] || { label: 'Unknown', icon: '❓', color: 'gray' }
            return (
              <div
                key={alert._id || idx}
                className={`alert-card alert-card--${senderInfo.color} animate-fade-in`}
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="alert-card-header">
                  <div className="alert-type-badge">
                    <span>{senderInfo.icon}</span>
                    <span>{senderInfo.label}</span>
                  </div>
                  <span className="alert-timestamp">📅 {formatDateTime(alert.timestamp)}</span>
                </div>
                <p className="alert-detail">{alert.details}</p>
                <div className="alert-tip">
                  💡 <strong>Reminder:</strong> Do not share personal information, passwords, or money with anyone.
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
