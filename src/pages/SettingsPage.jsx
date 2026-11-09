import { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '../services/api'
import './SettingsPage.css'

const DEFAULT_NAME = 'Your loved one'

export default function SettingsPage() {
  const [form, setForm] = useState({
    elderlyName: '',
    familyContactName: '',
    familyContactPhone: '',
    familyWhatsApp: '',
    checkinReminderTime: '09:00',
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [saveError, setSaveError] = useState('')

  useEffect(() => {
    getSettings()
      .then(res => {
        const data = { ...res.data }
        // Don't show the placeholder default as if it were a real name
        if (data.elderlyName === DEFAULT_NAME) data.elderlyName = ''
        setForm(prev => ({ ...prev, ...data }))
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
    setSaveError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSaveError('')
    try {
      await updateSettings({
        elderlyName: form.elderlyName,
        familyContactName: form.familyContactName,
        familyContactPhone: form.familyContactPhone,
        familyWhatsApp: form.familyWhatsApp,
        checkinReminderTime: form.checkinReminderTime,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 4000)
    } catch (err) {
      setSaveError('Settings were not saved. Please check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  const displayName = form.elderlyName || 'the person you support'

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Settings</h1>
          <p className="page-subtitle">Configure SafeNana for your family</p>
        </div>
      </div>

      {loadError && (
        <div className="card" role="alert" style={{ borderLeft: '6px solid #c0392b', marginBottom: '1rem' }}>
          <strong>⚠️ Cannot reach the server.</strong> Your current settings could not be loaded,
          so saving is turned off. Please refresh and try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Elderly User Details */}
        <section className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-icon">👴</span>
            <div>
              <h2 className="settings-section-title">Person Being Supported</h2>
              <p className="settings-section-desc">Details about the person you're caring for</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="field-group">
              <label htmlFor="elderlyName" className="field-label">
                Display Name
                <span className="field-hint">Shown on their screen and in the activity feed</span>
              </label>
              <input
                id="elderlyName"
                name="elderlyName"
                type="text"
                className="field-input"
                value={form.elderlyName || ''}
                onChange={handleChange}
                placeholder="e.g. Margaret, Grandma Rose"
                maxLength={100}
                required
                disabled={loading || loadError}
              />
            </div>
          </div>
        </section>

        {/* Family Contact */}
        <section className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-icon">👨‍👩‍👧</span>
            <div>
              <h2 className="settings-section-title">Family Contact</h2>
              <p className="settings-section-desc">Shown on the help screen so they can call directly</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="field-group">
              <label htmlFor="familyContactName" className="field-label">
                Contact Name
                <span className="field-hint">Shown on the help screen</span>
              </label>
              <input
                id="familyContactName"
                name="familyContactName"
                type="text"
                className="field-input"
                value={form.familyContactName || ''}
                onChange={handleChange}
                placeholder="e.g. Sarah (Daughter)"
                maxLength={100}
                disabled={loading || loadError}
              />
            </div>
            <div className="field-group">
              <label htmlFor="familyContactPhone" className="field-label">
                Phone Number
                <span className="field-hint">Include the country code, e.g. +1 (US), +44 (UK)</span>
              </label>
              <input
                id="familyContactPhone"
                name="familyContactPhone"
                type="tel"
                className="field-input"
                value={form.familyContactPhone || ''}
                onChange={handleChange}
                placeholder="e.g. +44 7700 900123"
                maxLength={30}
                disabled={loading || loadError}
              />
            </div>
            <div className="field-group">
              <label htmlFor="familyWhatsApp" className="field-label">
                WhatsApp Number
                <span className="field-hint">Saved for future notifications. Alerts are not sent yet.</span>
              </label>
              <input
                id="familyWhatsApp"
                name="familyWhatsApp"
                type="tel"
                className="field-input"
                value={form.familyWhatsApp || ''}
                onChange={handleChange}
                placeholder="e.g. +44 7700 900123"
                maxLength={30}
                disabled={loading || loadError}
              />
            </div>
          </div>
        </section>

        {/* Check-in Reminder */}
        <section className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-icon">⏰</span>
            <div>
              <h2 className="settings-section-title">Daily Check-in Time</h2>
              <p className="settings-section-desc">
                Preferred check-in time for {displayName}. Automatic reminders are coming soon.
              </p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="field-group">
              <label htmlFor="checkinReminderTime" className="field-label">
                Check-in Time
              </label>
              <input
                id="checkinReminderTime"
                name="checkinReminderTime"
                type="time"
                className="field-input field-input--narrow"
                value={form.checkinReminderTime || '09:00'}
                onChange={handleChange}
                disabled={loading || loadError}
              />
              <span className="field-tip">
                💡 Many people choose a time between 8am and 10am
              </span>
            </div>
          </div>
        </section>

        {/* Save button */}
        <div className="settings-actions">
          <button
            id="btn-save-settings"
            type="submit"
            className={`btn-save ${saved ? 'btn-save--success' : ''}`}
            disabled={saving || loading || loadError}
          >
            {saved ? '✅ Settings Saved!' : saving ? 'Saving...' : '💾 Save Settings'}
          </button>
          {saved && (
            <span className="save-confirmation animate-fade-in">
              Saved. The elder screen will show the new details next time it is opened.
            </span>
          )}
          {saveError && (
            <span role="alert" style={{ color: '#c0392b', marginLeft: '1rem' }}>
              {saveError}
            </span>
          )}
        </div>
      </form>
    </div>
  )
}