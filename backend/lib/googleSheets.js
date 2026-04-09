const { google } = require('googleapis')

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

function getServiceAccountCredentials() {
  const rawJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON

  if (rawJson) {
    return JSON.parse(rawJson)
  }

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = (process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY || '').replace(/\\n/g, '\n')

  if (!email || !privateKey) {
    throw new Error('Google service account credentials are missing')
  }

  return {
    client_email: email,
    private_key: privateKey,
  }
}

async function appendBookingRow(booking) {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID
  const sheetName = process.env.GOOGLE_SHEETS_SHEET_NAME || 'Bookings'

  if (!spreadsheetId) {
    throw new Error('GOOGLE_SHEETS_SPREADSHEET_ID is missing')
  }

  const credentials = getServiceAccountCredentials()
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  })

  const sheets = google.sheets({ version: 'v4', auth })

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:I`,
    valueInputOption: 'USER_ENTERED',
    insertDataOption: 'INSERT_ROWS',
    requestBody: {
      values: [[
        booking.bookingId,
        booking.name,
        booking.email,
        booking.phone,
        booking.service,
        booking.date,
        booking.time,
        booking.message,
        new Date().toISOString(),
      ]],
    },
  })
}

module.exports = {
  appendBookingRow,
}
