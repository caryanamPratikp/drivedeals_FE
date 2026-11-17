import { API_BASE_URL } from '../config/env.js';
import { getStoredToken } from '../lib/authStorage.js';

export async function apiClient(endpoint, { method = 'GET', body, headers = {}, ...customConfig } = {}) {
  const token = getStoredToken();

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    ...customConfig,
  };

  if (body !== undefined) {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json();

    if (!response.ok) {
      let errorMsg = data?.message || data?.detail || `Request failed with status ${response.status}`;
      if (data?.validationErrors && typeof data.validationErrors === 'object') {
        const details = Object.entries(data.validationErrors).map(([f, m]) => `${f}: ${m}`).join(', ');
        if (details) errorMsg += ` (${details})`;
      }
      const error = new Error(errorMsg);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data?.data !== undefined ? data.data : data;
  } catch (error) {
    if (error.status !== 409) {
      console.error(`[API Error] ${method} ${endpoint}:`, error);
    }
    throw error;
  }
}
