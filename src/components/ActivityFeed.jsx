import './ActivityFeed.css'

const EVENT_CONFIG = {
  checkin: {
    icon: '✅',
    label: 'Checked In',
    bgClass: 'event--green',
    iconBg: 'icon-bg--green'
  },
  suspicious_message: {
    icon: '⚠️',
    label: 'Suspicious Message',
    bgClass: 'event--red',
    iconBg: 'icon-bg--red'
  },
  help_request: {
    icon: '📞',
    label: 'Help Requested',
    bgClass: 'event--blue',
    iconBg: 'icon-bg--blue'
  },
  message_sent: {
    icon: '💬',
    label: 'Message Sent',
    bgClass: 'event--gray',
    iconBg: 'icon-bg--gray'
  }
}

function formatTime(dateStr) {
  const date = new Date(dateStr)
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatRelative(dateStr) {
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
  return `${diffDays}d ago`
}

const SENDER_LABELS = {
  unknown_number: 'Unknown Number 📵',
  whatsapp_forward: 'WhatsApp Forward 💬',
  someone_i_know: 'Someone They Know 🧑'
}

export default function ActivityFeed({ events, compact = false }) {
  if (!events || events.length === 0) {
    return (
      <div className="activity-empty">
        <span className="activity-empty-icon">🌿</span>
        <p>No activity yet. Check-ins will appear here.</p>
      </div>
    )
  }

  return (
    <div className="activity-feed">
      {events.map((event, idx) => {
        const config = EVENT_CONFIG[event.type] || EVENT_CONFIG.checkin
        return (
          <div
            key={event._id || idx}
            className={`activity-event ${config.bgClass} animate-fade-in`}
            style={{ animationDelay: `${idx * 0.05}s` }}
          >
            <div className={`activity-icon ${config.iconBg}`}>
              {config.icon}
            </div>
            <div className="activity-body">
              <div className="activity-top">
                <span className="activity-event-label">{config.label}</span>
                {event.senderType && (
                  <span className="activity-badge">
                    {SENDER_LABELS[event.senderType]}
                  </span>
                )}
              </div>
              <p className="activity-detail">{event.details}</p>
            </div>
            <div className="activity-time">
              <span className="activity-relative">{formatRelative(event.timestamp)}</span>
              <span className="activity-absolute">{formatTime(event.timestamp)}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}
