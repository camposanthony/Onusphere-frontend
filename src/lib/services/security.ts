/**
 * Security service for interacting with backend security API
 */
import { API_BASE_URL } from "../utils/api";
import { getToken } from "./auth";

// Update this with your backend API URL
const API_URL = API_BASE_URL;

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface UserSession {
  id: string;
  device_info: string;
  ip_address: string;
  location: string;
  created_at: string;
  last_activity: string;
  is_current: boolean;
}

export interface NotificationPreferences {
  notify_orders: boolean;
  notify_customers: boolean;
  notify_team: boolean;
  notify_system: boolean;
  notify_marketing: boolean;
  notify_realtime: boolean;
  notify_tasks: boolean;
}

/**
 * Change user password
 */
export const changePassword = async (passwordData: ChangePasswordRequest): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/security/change-password`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(passwordData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to change password');
  }
};

/**
 * Get all active sessions for the current user
 */
export const getUserSessions = async (): Promise<UserSession[]> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/security/sessions`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch sessions');
  }

  return await response.json();
};

/**
 * Log out a specific session
 */
export const logoutSession = async (sessionId: string): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/security/sessions/${sessionId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to logout session');
  }
};

/**
 * Log out all sessions except the current one
 */
export const logoutAllSessions = async (): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/security/sessions`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to logout all sessions');
  }
};

/**
 * Get user notification preferences
 */
export const getNotificationPreferences = async (): Promise<NotificationPreferences> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/security/notification-preferences`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch notification preferences');
  }

  return await response.json();
};

/**
 * Update user notification preferences
 */
export const updateNotificationPreferences = async (
  preferences: NotificationPreferences
): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/security/notification-preferences`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(preferences),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to update notification preferences');
  }
};

/**
 * Format session time for display
 */
export const formatSessionTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) {
    return 'Just now';
  } else if (diffMins < 60) {
    return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Get device icon based on device info
 */
export const getDeviceIcon = (deviceInfo: string): string => {
  const device = deviceInfo.toLowerCase();
  
  if (device.includes('mobile') || device.includes('android') || device.includes('iphone')) {
    return '📱';
  } else if (device.includes('tablet') || device.includes('ipad')) {
    return '📱';
  } else if (device.includes('mac') || device.includes('macbook')) {
    return '💻';
  } else if (device.includes('windows') || device.includes('pc')) {
    return '🖥️';
  } else if (device.includes('linux')) {
    return '🖥️';
  } else {
    return '💻';
  }
}; 