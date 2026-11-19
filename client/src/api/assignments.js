// All communication with the Express API lives here.
const BASE = import.meta.env.VITE_API_URL || '/api';

export class ApiError extends Error {
  constructor(message, status = 0, details = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details; // list of validation messages from the server
  }
}

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new ApiError('Cannot reach the server. Please check that the API is running.');
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    // response had no JSON body
  }

  if (!res.ok) {
    throw new ApiError(data?.message || `Request failed (${res.status})`, res.status, data?.errors || []);
  }
  return data;
}

export function getAssignments(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) query.set(key, value);
  });
  const qs = query.toString();
  return request(`/assignments${qs ? `?${qs}` : ''}`);
}

export const getAssignment = (id) => request(`/assignments/${id}`);

export const createAssignment = (body) =>
  request('/assignments', { method: 'POST', body: JSON.stringify(body) });

export const updateAssignment = (id, body) =>
  request(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(body) });

export const patchAssignment = (id, body) =>
  request(`/assignments/${id}`, { method: 'PATCH', body: JSON.stringify(body) });

export const deleteAssignment = (id) => request(`/assignments/${id}`, { method: 'DELETE' });
