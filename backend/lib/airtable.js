function getAirtableConfig() {
  const token = process.env.AIRTABLE_API_KEY
  const baseId = process.env.AIRTABLE_BASE_ID
  const tableName = process.env.AIRTABLE_TABLE_NAME || 'Bookings'

  if (!token) {
    throw new Error('AIRTABLE_API_KEY is missing')
  }

  if (!baseId) {
    throw new Error('AIRTABLE_BASE_ID is missing')
  }

  return { token, baseId, tableName }
}

function toAirtableTimeValue(date, time) {
  const dateStr = String(date || '').trim()
  const timeStr = String(time || '').trim()

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr) && /^\d{2}:\d{2}$/.test(timeStr)) {
    return `${dateStr}T${timeStr}:00`
  }

  return timeStr
}

async function appendBookingRow(booking) {
  const { token, baseId, tableName } = getAirtableConfig()
  const endpoint = `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(tableName)}`

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [
        {
          fields: {
            'Booking ID': booking.bookingId,
            Name: booking.name,
            Email: booking.email,
            Phone: booking.phone,
            Service: booking.service,
            Date: booking.date,
            Time: toAirtableTimeValue(booking.date, booking.time),
            Message: booking.message,
          },
        },
      ],
    }),
  })

  if (!response.ok) {
    let details = `${response.status} ${response.statusText}`

    try {
      const data = await response.json()
      if (data?.error?.type || data?.error?.message) {
        const type = data?.error?.type ? `[${data.error.type}] ` : ''
        const message = data?.error?.message || 'Unknown Airtable error'
        details = `${type}${message}`
      }
    } catch {
      // Keep default details when error payload is not JSON.
    }

    throw new Error(`Airtable write failed: ${details}`)
  }
}

module.exports = {
  appendBookingRow,
}
