const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000
const RATE_LIMIT_MAX_ATTEMPTS = 3

const attemptsByKey = new Map()

function nowMs() {
  return Date.now()
}

function pruneAttempts(timestamps, now) {
  return timestamps.filter((timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS)
}

function getRateLimitState(key) {
  const now = nowMs()
  const existing = attemptsByKey.get(key) || []
  const recentAttempts = pruneAttempts(existing, now)

  attemptsByKey.set(key, recentAttempts)

  const isLimited = recentAttempts.length >= RATE_LIMIT_MAX_ATTEMPTS
  const remainingMs = isLimited ? RATE_LIMIT_WINDOW_MS - (now - recentAttempts[0]) : 0

  return {
    isLimited,
    remainingMs,
    attempts: recentAttempts,
  }
}

function addRateLimitAttempt(key) {
  const existing = attemptsByKey.get(key) || []
  attemptsByKey.set(key, [...existing, nowMs()])
}

module.exports = {
  getRateLimitState,
  addRateLimitAttempt,
}
