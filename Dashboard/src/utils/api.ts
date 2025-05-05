// API utilities for making authenticated requests

// Base API URL - must match the URL in AuthContext
const API_URL = 'http://localhost:8000';

/**
 * Makes an authenticated API request
 * Automatically adds the auth token from localStorage to the request headers
 * Handles 401 Unauthorized responses by clearing auth data and redirecting to login
 */
export const fetchWithAuth = async (
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> => {
  const token = localStorage.getItem('authToken');
  const tokenType = localStorage.getItem('tokenType') || 'bearer';
  
  if (!token) {
    throw new Error('No authentication token found');
  }
  
  const headers = {
    ...(options.headers || {}),
    'Authorization': `${tokenType} ${token}`
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    });
    
    // Handle token expiration/invalid token
    if (response.status === 401) {
      // Clear invalid auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('tokenType');
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
      throw new Error('Authentication expired');
    }
    
    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

/**
 * Helper for making GET requests with authentication
 */
export const getWithAuth = (endpoint: string) => {
  return fetchWithAuth(endpoint, { method: 'GET' });
};

/**
 * Helper for making POST requests with authentication
 */
export const postWithAuth = (endpoint: string, data: any) => {
  return fetchWithAuth(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

/**
 * Helper for making PUT requests with authentication
 */
export const putWithAuth = (endpoint: string, data: any) => {
  return fetchWithAuth(endpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};

/**
 * Helper for making DELETE requests with authentication
 */
export const deleteWithAuth = (endpoint: string) => {
  return fetchWithAuth(endpoint, { method: 'DELETE' });
};
