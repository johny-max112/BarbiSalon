const { appendBookingRow } = require('../lib/googleSheets')
const { getRateLimitState, addRateLimitAttempt } = require('../lib/rateLimit')
const { verifyTurnstileToken } = require('../lib/turnstile')
const { validateBookingPayload } = require('../lib/validation')
const { generateBookingId } = require('../lib/bookingId')

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (forwarded) {
    return String(forwarded).split(',')[0].trim()
  }

  return req.socket?.remoteAddress || 'unknown'
}

function getDateRange() {
  const today = new Date()
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 90)

  return {
    todayIso: today.toISOString().split('T')[0],
    maxDateIso: maxDate.toISOString().split('T')[0],
  }
}

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: 'error', message: 'Method not allowed' })
  }

  try {
    const payload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {}

    if (String(payload.website || '').trim()) {
      return res.status(200).json({ status: 'success' })
    }

    const { todayIso, maxDateIso } = getDateRange()
    const errors = validateBookingPayload(payload, todayIso, maxDateIso)

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ status: 'error', message: 'Validation failed', errors })
    }

    const clientIp = getClientIp(req)
    const rateKey = `${clientIp}:${String(payload.email || '').toLowerCase()}`
    const rateLimit = getRateLimitState(rateKey)

    if (rateLimit.isLimited) {
      const minutes = Math.ceil(rateLimit.remainingMs / 60000)
      return res.status(429).json({
        status: 'error',
        message: `Too many attempts. Please wait about ${minutes} minute(s) and try again.`,
      })
    }

    const turnstileOk = await verifyTurnstileToken(payload.captchaToken, clientIp)
    if (!turnstileOk) {
      return res.status(400).json({ status: 'error', message: 'Captcha verification failed.' })
    }

    const bookingId = payload.bookingId || generateBookingId()

    await appendBookingRow({
      bookingId,
      name: String(payload.name || '').trim(),
      email: String(payload.email || '').trim(),
      phone: String(payload.phone || '').trim(),
      service: String(payload.service || '').trim(),
      date: String(payload.date || '').trim(),
      time: String(payload.time || '').trim(),
      message: String(payload.message || '').trim(),
    })

    addRateLimitAttempt(rateKey)

    return res.status(200).json({
      status: 'success',
      bookingId,
    })
  } catch (error) {
    console.error('Booking API error:', error)
    return res.status(500).json({
      status: 'error',
      message: 'Could not submit your booking. Please try again.',
    })
  }
}
