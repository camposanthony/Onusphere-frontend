/**
 * Authentication service for interacting with backend auth API
 */

// Update this with your backend API URL
const API_URL = 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  company_name?: string;
  company_type?: string;
  phone?: string;
  job_title?: string;
  timezone?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

/**
 * Login with email and password
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Login failed');
  }

  return await response.json();
};

/**
 * Register a new user
 */
export const signup = async (data: SignupData): Promise<AuthResponse> => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Registration failed');
  }

  return await response.json();
};

/**
 * Get the current auth token from local storage
 */
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
};

/**
 * Save the auth token to local storage
 */
export const saveToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_token', token);
  }
};

/**
 * Remove the auth token from local storage
 */
export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_token');
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};
