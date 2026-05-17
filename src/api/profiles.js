const API_BASE = "https://v2.api.noroff.dev"
const API_KEY = import.meta.env.VITE_API_KEY

function getHeaders() {
  const token = localStorage.getItem("token")
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  }
}

// Get profile bookings
export async function getProfileBookings(name) {
  const response = await fetch(
    `${API_BASE}/holidaze/profiles/${name}/bookings?_venue=true`,
    {
      headers: getHeaders(),
    }
  )
  const data = await response.json()
  return data.data
}

// Update avatar
export async function updateAvatar(name, avatarUrl) {
  const response = await fetch(
    `${API_BASE}/holidaze/profiles/${name}`,
    {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({
        avatar: {
          url: avatarUrl,
          alt: name,
        },
      }),
    }
  )
  const data = await response.json()
  return data.data
}