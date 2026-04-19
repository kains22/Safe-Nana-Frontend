import { useState, useEffect } from 'react'
import { postCheckin, postSuspicious, postHelp, getSettings } from '../services/api'
import { mockSettings } from '../services/mockData'
import './ElderlyInterface.css'

const SCREENS = {
  HOME: 'home',
  OKAY_CONFIRM: 'okay_confirm',
  SUSPICIOUS_CHOICE: 'suspicious_choice',
  SUSPICIOUS_CONFIRM: 'suspicious_confirm',
  HELP: 'help',
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function ElderlyInterface() {
  const [screen, setScreen] = useState(SCREENS.HOME)
  const [settings, setSettings] = useState(mockSettings)
  const [lastCheckin, setLastCheckin] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ripple, setRipple] = useState(null)

  useEffect(() => {
    getSettings()
      .then(res => setSettings(res.data))
      .catch(() => setSettings(mockSettings))
  }, [])

  const triggerRipple = (id) => {
    setRipple(id)
    setTimeout(() => setRipple(null), 600)
  }

  const handleCheckin = async () => {
    triggerRipple('okay')
    setLoading(true)
    try {
      await postCheckin()
    } catch (e) { /* offline mode */ }
    setLastCheckin(new Date())
    setLoading(false)
    setScreen(SCREENS.OKAY_CONFIRM)
  }

  const handleSuspicious = () => {
    triggerRipple('suspicious')
    setTimeout(() => setScreen(SCREENS.SUSPICIOUS_CHOICE), 200)
  }

  const handleSuspiciousReport = async (senderType) => {
    setLoading(true)
    try {
      await postSuspicious(senderType)
    } catch (e) { /* offline mode */ }
    setLoading(false)
    setScreen(SCREENS.SUSPICIOUS_CONFIRM)
  }

  const handleHelp = async () => {
    triggerRipple('help')
    setLoading(true)
    try {
      await postHelp()
    } catch (e) { /* offline mode */ }
    setLoading(false)
    setTimeout(() => setScreen(SCREENS.HELP), 200)
  }

  const goHome = () => setScreen(SCREENS.HOME)

  const formatTime = (date) => {
    if (!date) return 'Not checked in yet today'
    return `Last check-in: ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  }

  return (
    <div className="elderly-page">
      {/* Logo */}
      <div className="elderly-logo">
        <span className="elderly-logo-leaf">🌿</span>
        <span className="elderly-logo-text">SafeNana</span>
      </div>

      {/* HOME SCREEN */}
      {screen === SCREENS.HOME && (
        <div className="elderly-screen animate-slide-up">
          <div className="elderly-greeting">
            <div className="elderly-greeting-wave">👋</div>
            <h1 className="elderly-greeting-text">
              {getGreeting()},<br />
              <span className="elderly-name">{settings.elderlyName}!</span>
            </h1>
            <p className="elderly-subtext">How are you doing today?</p>
          </div>

          <div className="elderly-buttons">
            {/* OKAY button */}
            <button
              id="btn-okay"
              className={`elderly-btn elderly-btn--green ${ripple === 'okay' ? 'ripple' : ''}`}
              onClick={handleCheckin}
              disabled={loading}
              aria-label="I am okay today"
            >
              <span className="elderly-btn-icon">✅</span>
              <span className="elderly-btn-text">I'm Okay Today</span>
            </button>

            {/* SUSPICIOUS message button */}
            <button
              id="btn-suspicious"
              className={`elderly-btn elderly-btn--red ${ripple === 'suspicious' ? 'ripple' : ''}`}
              onClick={handleSuspicious}
              disabled={loading}
              aria-label="I got a suspicious message"
            >
              <span className="elderly-btn-icon">⚠️</span>
              <span className="elderly-btn-text">I Got a Suspicious Message</span>
            </button>

            {/* HELP button */}
            <button
              id="btn-help"
              className={`elderly-btn elderly-btn--blue ${ripple === 'help' ? 'ripple' : ''}`}
              onClick={handleHelp}
              disabled={loading}
              aria-label="I need help"
            >
              <span className="elderly-btn-icon">📞</span>
              <span className="elderly-btn-text">I Need Help</span>
            </button>
          </div>

          <div className="elderly-footer">
            <span className="elderly-checkin-time">
              🕐 {formatTime(lastCheckin)}
            </span>
          </div>
        </div>
      )}

      {/* OKAY CONFIRMATION SCREEN */}
      {screen === SCREENS.OKAY_CONFIRM && (
        <div className="elderly-screen elderly-confirm-screen animate-slide-up">
          <div className="elderly-confirm-icon animate-checkmark">✅</div>
          <h2 className="elderly-confirm-title">Wonderful!</h2>
          <p className="elderly-confirm-message">
            Great! Your family has been notified.
            They know you're safe and well. 💚
          </p>
          <button
            id="btn-okay-back"
            className="elderly-btn-back"
            onClick={goHome}
          >
            ← Go Back Home
          </button>
        </div>
      )}

      {/* SUSPICIOUS MESSAGE — CHOOSE SENDER */}
      {screen === SCREENS.SUSPICIOUS_CHOICE && (
        <div className="elderly-screen animate-slide-up">
          <div className="elderly-question-header">
            <div className="elderly-question-icon">🔍</div>
            <h2 className="elderly-question-title">Who sent it?</h2>
            <p className="elderly-question-sub">Tap the one that best describes the sender:</p>
          </div>

          <div className="elderly-choice-buttons">
            <button
              id="btn-sender-unknown"
              className="elderly-choice-btn"
              onClick={() => handleSuspiciousReport('unknown_number')}
              disabled={loading}
            >
              <span className="elderly-choice-icon">📵</span>
              <span>Unknown Number</span>
            </button>
            <button
              id="btn-sender-whatsapp"
              className="elderly-choice-btn"
              onClick={() => handleSuspiciousReport('whatsapp_forward')}
              disabled={loading}
            >
              <span className="elderly-choice-icon">💬</span>
              <span>WhatsApp Forward</span>
            </button>
            <button
              id="btn-sender-known"
              className="elderly-choice-btn"
              onClick={() => handleSuspiciousReport('someone_i_know')}
              disabled={loading}
            >
              <span className="elderly-choice-icon">🧑</span>
              <span>Someone I Know</span>
            </button>
          </div>

          <button className="elderly-btn-back" onClick={goHome}>
            ← Cancel, go back
          </button>
        </div>
      )}

      {/* SUSPICIOUS MESSAGE — CONFIRMED */}
      {screen === SCREENS.SUSPICIOUS_CONFIRM && (
        <div className="elderly-screen elderly-confirm-screen animate-slide-up">
          <div className="elderly-confirm-icon" style={{ fontSize: '4rem' }}>🛡️</div>
          <h2 className="elderly-confirm-title" style={{ color: 'var(--color-red)' }}>Alert Sent!</h2>
          <p className="elderly-confirm-message">
            Your family has been alerted.
          </p>
          <div className="elderly-warning-box">
            <strong>⚠️ Important:</strong><br />
            Do NOT share any personal information,<br />
            passwords, bank details or money.
          </div>
          <button
            id="btn-suspicious-back"
            className="elderly-btn-back"
            onClick={goHome}
          >
            ← I understand, go home
          </button>
        </div>
      )}

      {/* HELP SCREEN */}
      {screen === SCREENS.HELP && (
        <div className="elderly-screen animate-slide-up">
          <div className="elderly-question-header">
            <div className="elderly-question-icon">📞</div>
            <h2 className="elderly-question-title">Help is coming!</h2>
            <p className="elderly-question-sub">Your family has been notified. You can also call directly:</p>
          </div>

          <div className="elderly-contact-card">
            <div className="elderly-contact-avatar">
              {settings.familyContactName.charAt(0).toUpperCase()}
            </div>
            <div className="elderly-contact-info">
              <span className="elderly-contact-name">{settings.familyContactName}</span>
              <span className="elderly-contact-phone">{settings.familyContactPhone}</span>
            </div>
          </div>

          <a
            id="btn-call"
            href={`tel:${settings.familyContactPhone.replace(/\s/g, '')}`}
            className="elderly-btn elderly-btn--blue"
            style={{ textDecoration: 'none', display: 'flex', marginTop: 'var(--space-4)' }}
          >
            <span className="elderly-btn-icon">📞</span>
            <span className="elderly-btn-text">Call {settings.familyContactName}</span>
          </a>

          <button className="elderly-btn-back" onClick={goHome} style={{ marginTop: 'var(--space-6)' }}>
            ← Go Back Home
          </button>
        </div>
      )}
    </div>
  )
}
