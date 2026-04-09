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
            Time: booking.time,
            Message: booking.message,
            'Submitted At': new Date().toISOString(),
          },
        },
      ],
    }),
  })

  if (!response.ok) {
    let details = `${response.status} ${response.statusText}`

    try {
      const data = await response.json()
      if (data?.error?.message) {
        details = data.error.message
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
