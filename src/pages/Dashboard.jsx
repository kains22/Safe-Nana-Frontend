import { useState, useEffect } from 'react'
import { getEvents, getWeeklySummary, getSettings, sendMessage } from '../services/api'
import { mockEvents, mockWeeklySummary, mockSettings } from '../services/mockData'
import ActivityFeed from '../components/ActivityFeed'
import './Dashboard.css'

function formatRelativeTime(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
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
  const [settings, setSettings] = useState(mockSettings)
  const [message, setMessage] = useState('')
  const [messageSent, setMessageSent] = useState(false)
  const [sendingMsg, setSendingMsg] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsRes, summaryRes, settingsRes] = await Promise.all([
          getEvents(),
          getWeeklySummary(),
          getSettings()
        ])
        setEvents(eventsRes.data)
        setSummary(summaryRes.data)
        setSettings(settingsRes.data)
      } catch (err) {
        setEvents(mockEvents)
        setSummary(mockWeeklySummary)
        setSettings(mockSettings)
      } finally {
        setLoading(false)
      }
    }
    
    loadData()

    const intervalId = setInterval(() => {
      loadData()
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

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
    if (!message.trim()) return
    setSendingMsg(true)
    try {
      await sendMessage(message)
      setEvents(prev => [{
        _id: Date.now().toString(),
        type: 'message_sent',
        elderlyName: settings.elderlyName,
        details: `Family sent a message to ${settings.elderlyName}: "${message}"`,
        timestamp: new Date().toISOString()
      }, ...prev])
    } catch (e) {
      setEvents(prev => [{
        _id: Date.now().toString(),
        type: 'message_sent',
        elderlyName: settings.elderlyName,
        details: `Family sent a message to ${settings.elderlyName}: "${message}"`,
        timestamp: new Date().toISOString()
      }, ...prev])
    }
    setMessage('')
    setMessageSent(true)
    setSendingMsg(false)
    setTimeout(() => setMessageSent(false), 3000)
  }

  const checkinStatus = todayCheckin
    ? { ok: true, label: `${settings.elderlyName} checked in today ✅`, time: formatRelativeTime(todayCheckin.timestamp) }
    : { ok: false, label: `${settings.elderlyName} hasn't checked in yet ⚠️`, time: 'No check-in today' }

  return (
    <div className="dashboard animate-fade-in">
      {/* Page Title */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Family Dashboard</h1>
          <p className="dashboard-subtitle">Monitoring {settings.elderlyName}'s wellbeing in real-time</p>
        </div>
        <div className="dashboard-date">
          {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>

      {/* Main status card */}
      <div className={`status-card ${checkinStatus.ok ? 'status-card--ok' : 'status-card--warn'}`}>
        <div className="status-card-left">
          <div className="status-avatar">
            <div className="status-avatar-inner">
              {settings.elderlyName.charAt(0).toUpperCase()}
            </div>
            <div className={`status-dot ${checkinStatus.ok ? 'status-dot--ok' : 'status-dot--warn'}`} />
          </div>
          <div className="status-info">
            <h2 className="status-name">{settings.elderlyName}</h2>
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
            {checkinStatus.ok ? 'Safe' : 'Check on her'}
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
                  <div className="stat-bar-fill stat-bar-fill--green" style={{ width: `${(summary.checkins / 7) * 100}%` }} />
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
          <p className="weekly-summary-text">
            {summary && summary.checkins >= 5 ? '💚 Excellent week! Nana has been very consistent.' :
             summary && summary.checkins >= 3 ? '🟡 Good week overall. Keep encouraging daily check-ins.' :
             '🔴 Please check in with Nana — fewer check-ins than usual.'}
          </p>
        </div>

        {/* Send Message */}
        <div className="card message-card">
          <h3 className="card-title">💬 Send {settings.elderlyName} a Message</h3>
          <p className="card-subtitle">Send a warm message that will appear on her phone</p>
          <form onSubmit={handleSendMessage} className="message-form">
            <textarea
              id="message-input"
              className="message-textarea"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder={`Type a message for ${settings.elderlyName}... e.g. "Hi Mum! We're thinking of you 💚"`}
              rows={4}
              maxLength={200}
            />
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
            {[1,2,3].map(i => <div key={i} className="skeleton-item" />)}
          </div>
        ) : (
          <ActivityFeed events={events} />
        )}
      </div>
    </div>
  )
}
