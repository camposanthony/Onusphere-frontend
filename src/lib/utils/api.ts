/**
 * API utility functions for making authenticated requests
 */
import { getToken } from "../services/auth";

// Base API URL - update this with your backend URL
export const API_BASE_URL = "http://localhost:8000";

/**
 * Create headers with authentication token
 */
export const createAuthHeaders = () => {
  const token = getToken();
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  return headers;
};

/**
 * Make an authenticated GET request
 */
export async function authGet<T>(endpoint: string): Promise<T> {
  const headers = createAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API request failed: ${response.status}`);
  }

  return await response.json();
}

/**
 * Make an authenticated POST request
 */
export async function authPost<T, U = Record<string, unknown>>(
  endpoint: string,
  data: U,
): Promise<T> {
  const headers = createAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API request failed: ${response.status}`);
  }

  return await response.json();
}

/**
 * Make an authenticated PUT request
 */
export async function authPut<T, U = Record<string, unknown>>(
  endpoint: string,
  data: U,
): Promise<T> {
  const headers = createAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API request failed: ${response.status}`);
  }

  return await response.json();
}

/**
 * Make an authenticated DELETE request
 */
export async function authDelete<T>(endpoint: string): Promise<T> {
  const headers = createAuthHeaders();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API request failed: ${response.status}`);
  }

  return await response.json();
}
