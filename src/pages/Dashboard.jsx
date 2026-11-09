import { useState, useEffect } from 'react'
import { getEvents, getWeeklySummary, getSettings, sendMessage } from '../services/api'
import ActivityFeed from '../components/ActivityFeed'
import './Dashboard.css'

const DEFAULT_NAME = 'Your loved one'
const REFRESH_MS = 10000

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr)
  const diffMs = new Date() - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

export default function Dashboard() {
  const [events, setEvents] = useState([])
  const [summary, setSummary] = useState(null)
  const [settings, setSettings] = useState({ elderlyName: '' })
  const [message, setMessage] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const [messageError, setMessageError] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    let active = true

    const loadData = async () => {
      try {
        const [eventsRes, summaryRes, settingsRes] = await Promise.all([
          getEvents(),
          getWeeklySummary(),
          getSettings()
        ])
        if (!active) return
        setEvents(eventsRes.data)
        setSummary(summaryRes.data)
        setSettings(settingsRes.data)
        setLoadError(false)
        setLastUpdated(new Date())
      } catch (err) {
        // Keep the last real data on screen and tell the user the truth.
        if (active) setLoadError(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    const intervalId = setInterval(loadData, REFRESH_MS)
    return () => {
      active = false
      clearInterval(intervalId)
    }
  }, [])

  const name = settings.elderlyName || DEFAULT_NAME
  const hasRealName = Boolean(settings.elderlyName) && settings.elderlyName !== DEFAULT_NAME
  const initial = hasRealName ? name.charAt(0).toUpperCase() : '👤'

  const todayCheckin = events.find(e => {
    const eventDate = new Date(e.timestamp)
    const today = new Date()
    return e.type === 'checkin' &&
      eventDate.getDate() === today.getDate() &&
      eventDate.getMonth() === today.getMonth() &&
      eventDate.getFullYear() === today.getFullYear()
  })

  const handleSendMessage = async (e) => {
    e.preventDefault()
    const text = message.trim()
    if (!text) return

    setSendingMsg(true)
    setMessageError('')
    try {
      await sendMessage(text)
      setEvents(prev => [{
        _id: Date.now().toString(),
        type: 'message_sent',
        elderlyName: name,
        details: `Family sent a message to ${name}: "${text}"`,
        timestamp: new Date().toISOString()
      }, ...prev])
      setMessage('')
      setMessageSent(true)
      setTimeout(() => setMessageSent(false), 3000)
    } catch (err) {
      setMessageError('Message not sent. Please check your connection and try again.')
    } finally {
      setSendingMsg(false)
    }
  }

  const checkinStatus = todayCheckin
    ? { ok: true, label: `${name} checked in today ✅`, time: formatRelativeTime(todayCheckin.timestamp) }
    : { ok: false, label: `${name} hasn't checked in yet ⚠️`, time: 'No check-in today' }

  const summaryText = !summary
    ? ''
    : summary.checkins >= 5
      ? '💚 Consistent week: 5 or more check-ins.'
      : summary.checkins >= 3
        ? '🟡 Some check-ins missed this week.'
        : '🔴 Fewer check-ins than usual. Consider getting in touch.'

  return (
    <div className="dashboard animate-fade-in">
      {/* Page Title */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Family Dashboard</h1>
          <p className="dashboard-subtitle">
            Check-ins and alerts for {name}
            {lastUpdated && ` · Updated ${lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {loadError && (
        <div className="card" role="alert" style={{ borderLeft: '6px solid #c0392b', marginBottom: '1rem' }}>
          <strong>⚠️ Cannot reach the server.</strong>{' '}
          {events.length > 0
            ? 'The information below may be out of date. Retrying automatically.'
            : 'No information to show yet. Retrying automatically.'}
        </div>
      )}

      {/* Main status card */}
      <div className={`status-card ${checkinStatus.ok ? 'status-card--ok' : 'status-card--warn'}`}>
        <div className="status-card-left">
          <div className="status-avatar">
            <div className="status-avatar-inner">{initial}</div>
            <div className={`status-dot ${checkinStatus.ok ? 'status-dot--ok' : 'status-dot--warn'}`} />
          </div>
          <div className="status-info">
            <h2 className="status-name">{name}</h2>
            <p className={`status-label ${checkinStatus.ok ? 'status-label--ok' : 'status-label--warn'}`}>
              {checkinStatus.label}
            </p>
            <p className="status-time">🕐 {checkinStatus.time}</p>
          </div>
        </div>
        <div className={`status-indicator ${checkinStatus.ok ? 'status-indicator--ok' : 'status-indicator--warn'}`}>
          <span className="status-indicator-emoji">
            {checkinStatus.ok ? '✅' : '⚠️'}
          </span>
          <span className="status-indicator-text">
            {checkinStatus.ok ? 'Checked in' : 'Check on them'}
          </span>
        </div>
      </div>

      {/* Weekly summary + Send message */}
      <div className="dashboard-grid">
        {/* Weekly Summary */}
        <div className="card weekly-card">
          <h3 className="card-title">📊 This Week's Summary</h3>
          {summary && (
            <div className="weekly-stats">
              <div className="stat-item stat-item--green">
                <span className="stat-value">{summary.checkins}/7</span>
                <span className="stat-label">Check-ins</span>
                <div className="stat-bar">
                  <div className="stat-bar-fill stat-bar-fill--green" style={{ width: `${Math.min((summary.checkins / 7) * 100, 100)}%` }} />
                </div>
              </div>
              <div className="stat-item stat-item--red">
                <span className="stat-value">{summary.suspicious}</span>
                <span className="stat-label">Suspicious Msgs</span>
                <div className="stat-bar">
                  <div className="stat-bar-fill stat-bar-fill--red" style={{ width: `${Math.min((summary.suspicious / 5) * 100, 100)}%` }} />
                </div>
              </div>
              <div className="stat-item stat-item--blue">
                <span className="stat-value">{summary.helpRequests}</span>
                <span className="stat-label">Help Requests</span>
                <div className="stat-bar">
                  <div className="stat-bar-fill stat-bar-fill--blue" style={{ width: `${Math.min((summary.helpRequests / 3) * 100, 100)}%` }} />
                </div>
              </div>
            </div>
          )}
          <p className="weekly-summary-text">{summaryText}</p>
        </div>

        {/* Send Message */}
        <div className="card message-card">
          <h3 className="card-title">💬 Message for {name}</h3>
          <p className="card-subtitle">
            Messages are saved to the activity feed. (Showing them on the elder's screen is coming soon.)
          </p>
          <form onSubmit={handleSendMessage} className="message-form">
            <textarea
              id="message-input"
              className="message-textarea"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Type a message for ${name}... e.g. "We're thinking of you 💚"`}
              rows={4}
              maxLength={200}
            />
            {messageError && (
              <p role="alert" style={{ color: '#c0392b', margin: '0.5rem 0' }}>{messageError}</p>
            )}
            <div className="message-form-footer">
              <span className="message-char-count">{message.length}/200</span>
              <button
                id="btn-send-message"
                type="submit"
                className={`btn-primary ${messageSent ? 'btn-primary--success' : ''}`}
                disabled={sendingMsg || !message.trim()}
              >
                {messageSent ? '✅ Message Sent!' : sendingMsg ? 'Sending...' : '📤 Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="card activity-card">
        <div className="activity-card-header">
          <h3 className="card-title">📋 Activity Feed</h3>
          <span className="activity-count">{events.length} events</span>
        </div>
        {loading ? (
          <div className="loading-skeleton">
            {[1, 2, 3].map(i => <div key={i} className="skeleton-item" />)}
          </div>
        ) : (
          <ActivityFeed events={events} />
        )}
      </div>
    </div>
  )
}