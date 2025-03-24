import * as Sentry from '@sentry/browser';

const API_BASE_URL = '/api';

async function request(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}/${endpoint}`;
    console.log(`API request to ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log(`API response from ${url}:`, data);
    return data;
  } catch (error) {
    console.error(`API request error for ${endpoint}:`, error);
    Sentry.captureException(error);
    throw error;
  }
}

export const api = {
  get: (endpoint) => request(endpoint),
  post: (endpoint, data) => request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint, data) => request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint) => request(endpoint, { method: 'DELETE' }),
};