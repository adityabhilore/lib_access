const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api';

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.detail || `${res.status} ${res.statusText}` || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || data?.detail || `${res.status} ${res.statusText}` || 'Request failed';
    throw new Error(message);
  }
  return data;
}

export { API_BASE };
