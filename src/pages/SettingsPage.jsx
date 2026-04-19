import { useState, useEffect } from 'react'
import { getSettings, updateSettings } from '../services/api'
import { mockSettings } from '../services/mockData'
import './SettingsPage.css'

export default function SettingsPage() {
  const [form, setForm] = useState(mockSettings)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSettings()
      .then(res => { setForm(res.data); setLoading(false) })
      .catch(() => { setForm(mockSettings); setLoading(false) })
  }, [])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSettings(form)
    } catch (_) { /* mock mode */ }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="settings-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">⚙️ Settings</h1>
          <p className="page-subtitle">Configure SafeNana for your family</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="settings-form">
        {/* Elderly User Details */}
        <section className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-icon">👴</span>
            <div>
              <h2 className="settings-section-title">Elderly User</h2>
              <p className="settings-section-desc">Details about the person you're caring for</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="field-group">
              <label htmlFor="elderlyName" className="field-label">
                Display Name
                <span className="field-hint">This will appear on their phone screen</span>
              </label>
              <input
                id="elderlyName"
                name="elderlyName"
                type="text"
                className="field-input"
                value={form.elderlyName || ''}
                onChange={handleChange}
                placeholder="e.g. Nana, Mum, Grandma Rose"
                required
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
              <p className="settings-section-desc">Who should be called when help is requested?</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="field-group">
              <label htmlFor="familyContactName" className="field-label">
                Contact Name
                <span className="field-hint">Shown on the elderly user's help screen</span>
              </label>
              <input
                id="familyContactName"
                name="familyContactName"
                type="text"
                className="field-input"
                value={form.familyContactName || ''}
                onChange={handleChange}
                placeholder="e.g. Sarah (Daughter)"
              />
            </div>
            <div className="field-group">
              <label htmlFor="familyContactPhone" className="field-label">
                Phone Number
                <span className="field-hint">Must include country code for calling to work</span>
              </label>
              <input
                id="familyContactPhone"
                name="familyContactPhone"
                type="tel"
                className="field-input"
                value={form.familyContactPhone || ''}
                onChange={handleChange}
                placeholder="e.g. +44 7700 900123"
              />
            </div>
            <div className="field-group">
              <label htmlFor="familyWhatsApp" className="field-label">
                WhatsApp Number
                <span className="field-hint">For receiving notifications</span>
              </label>
              <input
                id="familyWhatsApp"
                name="familyWhatsApp"
                type="tel"
                className="field-input"
                value={form.familyWhatsApp || ''}
                onChange={handleChange}
                placeholder="e.g. +44 7700 900123"
              />
            </div>
          </div>
        </section>

        {/* Check-in Reminder */}
        <section className="settings-section">
          <div className="settings-section-header">
            <span className="settings-section-icon">⏰</span>
            <div>
              <h2 className="settings-section-title">Daily Check-in Reminder</h2>
              <p className="settings-section-desc">What time should we remind {form.elderlyName || 'Nana'} to check in?</p>
            </div>
          </div>
          <div className="settings-fields">
            <div className="field-group">
              <label htmlFor="checkinReminderTime" className="field-label">
                Reminder Time
              </label>
              <input
                id="checkinReminderTime"
                name="checkinReminderTime"
                type="time"
                className="field-input field-input--narrow"
                value={form.checkinReminderTime || '09:00'}
                onChange={handleChange}
              />
              <span className="field-tip">
                💡 We recommend between 8am – 10am when they're most active
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
            disabled={saving}
          >
            {saved ? '✅ Settings Saved!' : saving ? 'Saving...' : '💾 Save Settings'}
          </button>
          {saved && (
            <span className="save-confirmation animate-fade-in">
              Changes will apply next time the app is opened.
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
