import { getToken } from './auth';

const API_URL = 'http://localhost:8000';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'manager' | 'member';
  date_created: string;
}

export interface Account {
  id: string;
  name: string;
  email: string;
  company_code: string;
  date_created: string;
}

export interface CompanySettings {
  name: string;
  email: string;
  company_code: string;
}

export interface UserSettings {
  name: string;
  email: string;
  phone?: string;
  role: string;
}

/**
 * Get all members of the current account
 */
export const getMembers = async (): Promise<Member[]> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/members`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch members');
  }

  return await response.json();
};

/**
 * Get current account settings
 */
export const getCompanySettings = async (): Promise<CompanySettings> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/account/settings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch company settings');
  }

  return await response.json();
};

/**
 * Get current user settings
 */
export const getUserSettings = async (): Promise<UserSettings> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/me/settings`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch user settings');
  }

  return await response.json();
};

/**
 * Update user settings
 */
export const updateUserSettings = async (settings: Partial<UserSettings>): Promise<UserSettings> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/me/settings`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update user settings');
  }

  return await response.json();
};

/**
 * Update company settings
 */
export const updateCompanySettings = async (settings: Partial<CompanySettings>): Promise<CompanySettings> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/account/settings`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update company settings');
  }

  return await response.json();
}; 