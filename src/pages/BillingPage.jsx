import './BillingPage.css'

const WORKS_TODAY = [
  { icon: '✅', text: 'Daily check-in recording' },
  { icon: '🛡️', text: 'Suspicious message reporting' },
  { icon: '📞', text: 'Help requests, with a tap-to-call family contact' },
  { icon: '📊', text: 'Weekly summary of check-ins and alerts' },
  { icon: '💬', text: 'Family messages saved to the activity feed' },
]

const COMING_SOON = [
  { icon: '🔔', text: 'Push, SMS and email alerts to family' },
  { icon: '⏰', text: 'Automatic check-in reminders and missed check-in alerts' },
  { icon: '🔐', text: 'User accounts and secure login' },
  { icon: '👥', text: 'Multiple residents, caregivers and roles' },
  { icon: '📄', text: 'Downloadable PDF and CSV reports' },
]

const CONTACT = 'kains.faisal22@outlook.com'

export default function BillingPage() {
  return (
    <div className="billing-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🤝 Pilot Programme</h1>
          <p className="page-subtitle">
            SafeNana is a prototype. Paid plans are not available yet.
          </p>
        </div>
      </div>

      <div className="billing-content">
        <div className="pricing-card">
          <div className="pricing-header">
            <div className="pricing-logo">
              <span>🌿</span>
              <span>SafeNana</span>
            </div>
            <h2 className="pricing-plan-name">Join the pilot</h2>
            <p className="pricing-plan-desc">
              We are looking for care organisations and families to help shape the product.
              Pilot pricing will be agreed individually.
            </p>
          </div>

          <div className="pricing-divider" />

          <h3 className="trust-title">Working today</h3>
          <ul className="features-list">
            {WORKS_TODAY.map((f, i) => (
              <li key={i} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="pricing-divider" />

          <h3 className="trust-title">In development</h3>
          <ul className="features-list">
            {COMING_SOON.map((f, i) => (
              <li key={i} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="pricing-divider" />

          <a
            id="btn-pilot-contact"
            className="btn-subscribe"
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
            href={`mailto:${CONTACT}?subject=SafeNana%20pilot%20enquiry`}
          >
            <span>✉️</span>
            <span>Ask about a pilot</span>
          </a>

          <p className="pricing-guarantee">
            Not an emergency service. In an emergency, call your local emergency number.
          </p>
        </div>

        <div className="trust-column">
          <div className="trust-card">
            <h3 className="trust-title">💚 Why SafeNana?</h3>
            <p className="trust-desc">
              SafeNana was built after the founder's grandmother nearly lost her savings
              to a phone scammer. The design goal is simple: an interface an older person
              can use with confidence, and a way for family to stay informed.
            </p>
            <p className="trust-desc" style={{ marginTop: 'var(--space-3)' }}>
              It is an early prototype and we are improving it with feedback from older
              adults and care organisations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}