const API_BASE = "https://v2.api.noroff.dev/holidaze"
const API_KEY = import.meta.env.VITE_API_KEY

function getHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  }
}

export async function createBooking(bookingData) {
  const response = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(bookingData),
  })
  const data = await response.json()
  return data
}

export async function deleteBooking(id) {
  const response = await fetch (`${API_BASE}/bookings/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
    })
    return response
}