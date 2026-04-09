function generateBookingId() {
  const randomPart = Math.random().toString(36).slice(2, 10).toUpperCase()
  return `GLW-${Date.now().toString(36).toUpperCase()}-${randomPart}`
}

module.exports = {
  generateBookingId,
}
