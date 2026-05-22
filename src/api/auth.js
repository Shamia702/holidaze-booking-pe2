const API_BASE = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_API_KEY;

export async function registerUser(userData) {
  const response = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  return data;
}

export async function loginUser(credentials) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  const data = await response.json();
  return data;
}

export async function getProfile(name, token) {
  const response = await fetch(`${API_BASE}/holidaze/profiles/${name}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "X-Noroff-API-Key": API_KEY,
    },
  });
  const data = await response.json();
  return data.data;
}
