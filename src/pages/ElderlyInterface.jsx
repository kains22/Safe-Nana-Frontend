import { useState, useEffect } from 'react'
import { postCheckin, postSuspicious, postHelp, getSettings } from '../services/api'
import './ElderlyInterface.css'

const SCREENS = {
  HOME: 'home',
  OKAY_CONFIRM: 'okay_confirm',
  SUSPICIOUS_CHOICE: 'suspicious_choice',
  SUSPICIOUS_CONFIRM: 'suspicious_confirm',
  HELP: 'help',
}

const DEFAULT_NAME = 'Your loved one'
const EMPTY_SETTINGS = {
  elderlyName: '',
  familyContactName: '',
  familyContactPhone: '',
}

const SEND_ERROR =
  'Not sent. Please check your internet and try again. If it is urgent, call someone or your local emergency number.'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good Morning'
  if (hour < 17) return 'Good Afternoon'
  return 'Good Evening'
}

export default function ElderlyInterface() {
  const [screen, setScreen] = useState(SCREENS.HOME)
  const [settings, setSettings] = useState(EMPTY_SETTINGS)
  const [lastCheckin, setLastCheckin] = useState(null)
  const [loading, setLoading] = useState(false)
  const [ripple, setRipple] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getSettings()
      .then(res => setSettings({ ...EMPTY_SETTINGS, ...res.data }))
      .catch(() => setSettings(EMPTY_SETTINGS))
  }, [])

  const name =
    settings.elderlyName && settings.elderlyName !== DEFAULT_NAME
      ? settings.elderlyName
      : ''
  const contactName = settings.familyContactName || ''
  const contactPhone = settings.familyContactPhone || ''
  const hasContact = Boolean(contactName && contactPhone)

  const triggerRipple = (id) => {
    setRipple(id)
    setTimeout(() => setRipple(null), 600)
  }

  // Runs a request. Returns true only if the server confirmed it.
  const send = async (request) => {
    setError('')
    setLoading(true)
    try {
      await request()
      return true
    } catch (e) {
      setError(SEND_ERROR)
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleCheckin = async () => {
    triggerRipple('okay')
    const ok = await send(postCheckin)
    if (ok) {
      setLastCheckin(new Date())
      setScreen(SCREENS.OKAY_CONFIRM)
    }
  }

  const handleSuspicious = () => {
    triggerRipple('suspicious')
    setError('')
    setTimeout(() => setScreen(SCREENS.SUSPICIOUS_CHOICE), 200)
  }

  const handleSuspiciousReport = async (senderType) => {
    const ok = await send(() => postSuspicious(senderType))
    if (ok) setScreen(SCREENS.SUSPICIOUS_CONFIRM)
  }

  const handleHelp = async () => {
    triggerRipple('help')
    const ok = await send(postHelp)
    if (ok) setTimeout(() => setScreen(SCREENS.HELP), 200)
  }

  const goHome = () => {
    setError('')
    setScreen(SCREENS.HOME)
  }

  const formatTime = (date) => {
    if (!date) return 'Not checked in yet today'
    return `Last check-in: ${date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
  }

  const errorBox = error && (
    <div className="elderly-warning-box" role="alert" style={{ marginTop: 'var(--space-4)' }}>
      <strong>⚠️ {error}</strong>
    </div>
  )

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
              {name ? (
                <>
                  {getGreeting()},<br />
                  <span className="elderly-name">{name}!</span>
                </>
              ) : (
                <span className="elderly-name">{getGreeting()}!</span>
              )}
            </h1>
            <p className="elderly-subtext">How are you doing today?</p>
          </div>

          <div className="elderly-buttons">
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

          {loading && <p className="elderly-subtext" role="status">Sending…</p>}
          {errorBox}

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
          <h2 className="elderly-confirm-title">Thank you!</h2>
          <p className="elderly-confirm-message">
            Your check-in has been recorded. 💚
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

          {loading && <p className="elderly-subtext" role="status">Sending…</p>}
          {errorBox}

          <button className="elderly-btn-back" onClick={goHome}>
            ← Cancel, go back
          </button>
        </div>
      )}

      {/* SUSPICIOUS MESSAGE — CONFIRMED */}
      {screen === SCREENS.SUSPICIOUS_CONFIRM && (
        <div className="elderly-screen elderly-confirm-screen animate-slide-up">
          <div className="elderly-confirm-icon" style={{ fontSize: '4rem' }}>🛡️</div>
          <h2 className="elderly-confirm-title" style={{ color: 'var(--color-red)' }}>Report Recorded</h2>
          <p className="elderly-confirm-message">
            Please check with someone you trust before replying.
          </p>
          <div className="elderly-warning-box">
            <strong>⚠️ Important:</strong><br />
            Do NOT click links or share personal information,<br />
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
            <h2 className="elderly-question-title">Request Recorded</h2>
            <p className="elderly-question-sub">
              {hasContact
                ? 'Please call your contact directly now:'
                : 'Please call someone you trust now.'}
            </p>
          </div>

          {hasContact && (
            <>
              <div className="elderly-contact-card">
                <div className="elderly-contact-avatar">
                  {contactName.charAt(0).toUpperCase()}
                </div>
                <div className="elderly-contact-info">
                  <span className="elderly-contact-name">{contactName}</span>
                  <span className="elderly-contact-phone">{contactPhone}</span>
                </div>
              </div>

              <a
                id="btn-call"
                href={`tel:${contactPhone.replace(/\s/g, '')}`}
                className="elderly-btn elderly-btn--blue"
                style={{ textDecoration: 'none', display: 'flex', marginTop: 'var(--space-4)' }}
              >
                <span className="elderly-btn-icon">📞</span>
                <span className="elderly-btn-text">Call {contactName}</span>
              </a>
            </>
          )}

          <div className="elderly-warning-box" style={{ marginTop: 'var(--space-4)' }}>
            <strong>🚨 In an emergency,</strong><br />
            call your local emergency number straight away.
          </div>

          <button className="elderly-btn-back" onClick={goHome} style={{ marginTop: 'var(--space-6)' }}>
            ← Go Back Home
          </button>
        </div>
      )}
    </div>
  )
}