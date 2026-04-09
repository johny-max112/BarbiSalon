function normalizePhoneNumber(value) {
  return String(value || '').replace(/[\s-]/g, '')
}

function getBusinessHours(dateString) {
  if (!dateString) {
    return { start: '09:00', end: '20:00' }
  }

  const day = new Date(`${dateString}T00:00:00`).getDay()
  if (day === 0) {
    return { start: '10:00', end: '18:00' }
  }

  return { start: '09:00', end: '20:00' }
}

function validateBookingPayload(form, todayIso, maxDateIso) {
  const errors = {}

  if (String(form.fullName || '').trim().length < 2) {
    errors.fullName = 'Please enter your full name.'
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(form.email || '').trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  const phone = normalizePhoneNumber(String(form.phone || '').trim())
  if (!/^(?:\+63|0)9\d{9}$/.test(phone)) {
    errors.phone = 'Use PH format: 09XXXXXXXXX or +639XXXXXXXXX.'
  }

  if (!form.service) {
    errors.service = 'Please select a service.'
  }

  if (!form.date) {
    errors.date = 'Please choose a booking date.'
  } else if (form.date < todayIso) {
    errors.date = 'Date cannot be in the past.'
  } else if (form.date > maxDateIso) {
    errors.date = 'Please choose a date within the next 90 days.'
  }

  if (!form.time) {
    errors.time = 'Please choose a booking time.'
  } else {
    const hours = getBusinessHours(form.date)
    if (form.time < hours.start || form.time > hours.end) {
      errors.time = 'Selected time is outside business hours.'
    }
  }

  return errors
}

module.exports = {
  validateBookingPayload,
}
