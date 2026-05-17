const API_BASE = "https://v2.api.noroff.dev/holidaze"

export async function getVenues() {
  const response = await fetch(`${API_BASE}/venues`)
  const data = await response.json()
  return data.data
}

export async function getVenueById(id) {
  const response = await fetch(
    `${API_BASE}/venues/${id}?_owner=true&_bookings=true`
  )
  const data = await response.json()
  return data.data
}