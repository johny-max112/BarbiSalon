async function verifyTurnstileToken(token, remoteIp) {
  const secret = process.env.TURNSTILE_SECRET_KEY || ''

  if (!secret) {
    return true
  }

  if (!token) {
    return false
  }

  const body = new URLSearchParams()
  body.set('secret', secret)
  body.set('response', token)

  if (remoteIp) {
    body.set('remoteip', remoteIp)
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) {
    return false
  }

  const result = await response.json()
  return Boolean(result.success)
}

module.exports = {
  verifyTurnstileToken,
}
