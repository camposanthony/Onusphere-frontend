/**
 * Authentication service for interacting with backend auth API
 */

// Update this with your backend API URL
const API_URL = 'http://localhost:8000';

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupData {
  name: string;
  email: string;
  password: string;
  company_name?: string;
  company_email?: string;
  company_code?: string;
  company_type?: string;
  phone?: string;
  job_title?: string;
  timezone?: string;
  registration_type: 'business' | 'member';
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
  const endpoint = data.registration_type === 'business' 
    ? '/auth/create-business-account'
    : '/auth/add-new-member';

  const payload = data.registration_type === 'business'
    ? {
        business_name: data.company_name,
        business_email: data.company_email,
        full_name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone
      }
    : {
        company_code: data.company_code,
        full_name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone
      };

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
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
