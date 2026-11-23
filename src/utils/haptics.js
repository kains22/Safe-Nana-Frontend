const KEY = 'safenana_vibration'

export const PATTERNS = {
  tap: [60],                 // crisp pulse on a button tap
  confirm: [80, 50, 120],    // double pulse: action confirmed
  urgent: [200, 100, 200],   // strong pulse: help request sent
}

export function isHapticEnabled() {
  try { return localStorage.getItem(KEY) !== 'off' } catch { return true }
}

export function setHapticEnabled(on) {
  try { localStorage.setItem(KEY, on ? 'on' : 'off') } catch { /* ignore */ }
}

// Safe everywhere: does nothing on iPhone or desktop, and never throws.
export function triggerHapticFeedback(pattern) {
  if (!isHapticEnabled()) return
  try { navigator?.vibrate?.(pattern) } catch { /* ignore */ }
}