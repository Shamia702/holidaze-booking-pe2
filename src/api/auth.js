const API_BASE = "https://v2.api.noroff.dev"

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
  const data = await response.json()
  return data
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })
  const data = await response.json()
  return data
}