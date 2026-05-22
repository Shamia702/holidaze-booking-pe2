const API_BASE = "https://v2.api.noroff.dev/holidaze";
const API_KEY = import.meta.env.VITE_API_KEY;

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    "X-Noroff-API-Key": API_KEY,
  };
}

export async function getVenues() {
  const response = await fetch(
    `${API_BASE}/venues?limit=100&page=1&sort=created&sortOrder=desc`,
  );
  const data = await response.json();
  return data.data;
}

export async function getVenueById(id) {
  const response = await fetch(
    `${API_BASE}/venues/${id}?_owner=true&_bookings=true`,
  );
  const data = await response.json();
  return data.data;
}

export async function getManagerVenues(name) {
  const response = await fetch(
    `${API_BASE}/profiles/${name}/venues?_bookings=true`,
    { headers: getHeaders() },
  );
  const data = await response.json();
  return data.data;
}

export async function createVenue(venueData) {
  const response = await fetch(`${API_BASE}/venues`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(venueData),
  });
  const data = await response.json();
  return data;
}

export async function updateVenue(id, venueData) {
  const response = await fetch(`${API_BASE}/venues/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(venueData),
  });
  const data = await response.json();
  return data;
}

export async function deleteVenue(id) {
  const response = await fetch(`${API_BASE}/venues/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  return response;
}

export async function searchVenues(query) {
  const response = await fetch(`${API_BASE}/venues/search?q=${query}`);
  const data = await response.json();
  return data.data;
}
