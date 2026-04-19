import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' }
})

// Events
export const getEvents = () => api.get('/events')
export const getWeeklySummary = () => api.get('/events/weekly-summary')
export const getAlerts = () => api.get('/events/alerts')
export const postCheckin = () => api.post('/events/checkin')
export const postSuspicious = (senderType) => api.post('/events/suspicious', { senderType })
export const postHelp = () => api.post('/events/help')
export const sendMessage = (message) => api.post('/events/message', { message })

// Settings
export const getSettings = () => api.get('/settings')
export const updateSettings = (data) => api.put('/settings', data)

export default api
