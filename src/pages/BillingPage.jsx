import { useState } from 'react'
import './BillingPage.css'

const FEATURES = [
  { icon: '✅', text: 'Daily check-in monitoring' },
  { icon: '🛡️', text: 'Scam & fraud message alerts' },
  { icon: '📞', text: 'One-tap family calling' },
  { icon: '📊', text: 'Weekly wellbeing reports' },
  { icon: '💬', text: 'Family messaging to elderly user' },
  { icon: '🔔', text: 'Real-time push notifications' },
  { icon: '⏰', text: 'Customisable check-in reminders' },
  { icon: '💚', text: 'Unlimited family members' },
]

export default function BillingPage() {
  const [subscribed, setSubscribed] = useState(false)
  const [billing, setBilling] = useState('monthly')

  const handleSubscribe = () => {
    setSubscribed(true)
  }

  return (
    <div className="billing-page animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">💳 Billing & Subscription</h1>
          <p className="page-subtitle">Simple, affordable peace of mind for your whole family</p>
        </div>
      </div>

      {/* Billing toggle */}
      <div className="billing-toggle">
        <button
          id="toggle-monthly"
          className={`toggle-btn ${billing === 'monthly' ? 'toggle-btn--active' : ''}`}
          onClick={() => setBilling('monthly')}
        >
          Monthly
        </button>
        <button
          id="toggle-annual"
          className={`toggle-btn ${billing === 'annual' ? 'toggle-btn--active' : ''}`}
          onClick={() => setBilling('annual')}
        >
          Annual
          <span className="save-badge">Save 20%</span>
        </button>
      </div>

      <div className="billing-content">
        {/* Pricing card */}
        <div className="pricing-card">
          {billing === 'annual' && (
            <div className="popular-banner">🌟 Most Popular — Best Value</div>
          )}
          <div className="pricing-header">
            <div className="pricing-logo">
              <span>🌿</span>
              <span>SafeNana</span>
            </div>
            <h2 className="pricing-plan-name">Family Plan</h2>
            <p className="pricing-plan-desc">Everything you need to keep {billing === 'annual' ? 'an elderly loved one' : 'Nana'} safe</p>
          </div>

          <div className="pricing-price">
            <span className="price-currency">£</span>
            <span className="price-amount">{billing === 'annual' ? '8' : '10'}</span>
            <span className="price-period">/ month</span>
          </div>

          {billing === 'annual' && (
            <div className="annual-note">Billed as £96/year — saving £24 vs monthly</div>
          )}

          <div className="pricing-divider" />

          <ul className="features-list">
            {FEATURES.map((f, i) => (
              <li key={i} className="feature-item">
                <span className="feature-icon">{f.icon}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ul>

          <div className="pricing-divider" />

          {subscribed ? (
            <div className="subscribed-banner animate-slide-up">
              <span className="subscribed-icon">✅</span>
              <div>
                <strong>You're subscribed! 🎉</strong>
                <p>Thank you for choosing SafeNana. Your family is now protected.</p>
              </div>
            </div>
          ) : (
            <button
              id="btn-subscribe"
              className="btn-subscribe"
              onClick={handleSubscribe}
            >
              <span>💚</span>
              <span>Subscribe — £{billing === 'annual' ? '8' : '10'}/month</span>
            </button>
          )}

          <p className="pricing-guarantee">
            🔒 Cancel anytime · No contracts · 14-day free trial
          </p>
        </div>

        {/* Trust signals */}
        <div className="trust-column">
          <div className="trust-card">
            <h3 className="trust-title">💚 Why SafeNana?</h3>
            <p className="trust-desc">
              SafeNana was built by a family who experienced the anxiety of an elderly parent living alone.
              We know how important peace of mind is — and how frightening scam calls can be.
            </p>
            <p className="trust-desc" style={{ marginTop: 'var(--space-3)' }}>
              Our simple, warm interface was designed specifically so that elderly users feel
              <em> confident</em> — not overwhelmed. And families can breathe easier.
            </p>
          </div>

          <div className="testimonials">
            {[
              { name: 'Sarah, London', quote: "I check the dashboard every morning. It's the first thing I do. Knowing Mum has pressed the green button is such a relief.", avatar: 'S' },
              { name: 'James, Manchester', quote: "My gran got three scam calls last month. SafeNana helped us catch them all before she lost any money.", avatar: 'J' },
            ].map((t, i) => (
              <div key={i} className="testimonial-card">
                <div className="testimonial-avatar">{t.avatar}</div>
                <div>
                  <p className="testimonial-quote">"{t.quote}"</p>
                  <p className="testimonial-name">— {t.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
