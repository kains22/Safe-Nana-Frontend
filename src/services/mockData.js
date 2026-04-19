// Mock data for when the backend is unavailable
export const mockSettings = {
  elderlyName: 'Nana',
  familyContactName: 'Sarah (Daughter)',
  familyContactPhone: '+44 7700 900123',
  familyWhatsApp: '+44 7700 900123',
  checkinReminderTime: '09:00'
}

const now = new Date()
const dayMs = 24 * 60 * 60 * 1000

export const mockEvents = [
  {
    _id: '1',
    type: 'checkin',
    elderlyName: 'Nana',
    details: 'Nana confirmed they are okay today.',
    timestamp: new Date(now - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '2',
    type: 'suspicious_message',
    elderlyName: 'Nana',
    senderType: 'unknown_number',
    details: 'Nana received a suspicious message from an unknown number.',
    timestamp: new Date(now - dayMs - 3 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '3',
    type: 'checkin',
    elderlyName: 'Nana',
    details: 'Nana confirmed they are okay today.',
    timestamp: new Date(now - dayMs - 5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '4',
    type: 'help_request',
    elderlyName: 'Nana',
    details: 'Nana requested help.',
    timestamp: new Date(now - 2 * dayMs - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '5',
    type: 'message_sent',
    elderlyName: 'Nana',
    details: "Family sent a message to Nana: \"Hi Mum! Hope you're having a lovely day. Call us anytime! ❤️\"",
    timestamp: new Date(now - 2 * dayMs - 0.5 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '6',
    type: 'checkin',
    elderlyName: 'Nana',
    details: 'Nana confirmed they are okay today.',
    timestamp: new Date(now - 2 * dayMs - 6 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '7',
    type: 'suspicious_message',
    elderlyName: 'Nana',
    senderType: 'whatsapp_forward',
    details: 'Nana received a suspicious message from a WhatsApp forward.',
    timestamp: new Date(now - 3 * dayMs - 4 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '8',
    type: 'checkin',
    elderlyName: 'Nana',
    details: 'Nana confirmed they are okay today.',
    timestamp: new Date(now - 3 * dayMs - 7 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '9',
    type: 'suspicious_message',
    elderlyName: 'Nana',
    senderType: 'someone_i_know',
    details: 'Nana received a suspicious message from someone they know.',
    timestamp: new Date(now - 4 * dayMs - 2 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '10',
    type: 'checkin',
    elderlyName: 'Nana',
    details: 'Nana confirmed they are okay today.',
    timestamp: new Date(now - 5 * dayMs - 8 * 60 * 60 * 1000).toISOString()
  },
  {
    _id: '11',
    type: 'checkin',
    elderlyName: 'Nana',
    details: 'Nana confirmed they are okay today.',
    timestamp: new Date(now - 6 * dayMs - 9 * 60 * 60 * 1000).toISOString()
  }
]

export const mockWeeklySummary = {
  checkins: 6,
  suspicious: 3,
  helpRequests: 1,
  total: 11
}
