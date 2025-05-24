/**
 * Notification service for interacting with backend notification API
 */
import { API_BASE_URL } from "../utils/api";
import { getToken } from "./auth";

// Update this with your backend API URL
const API_URL = API_BASE_URL;

export interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'order' | 'customer' | 'team' | 'system' | 'security';
  is_read: boolean;
  created_at: string;
  read_at?: string;
  metadata: Record<string, any>;
}

export interface NotificationCount {
  unread_count: number;
}

export interface CreateNotificationRequest {
  title: string;
  description: string;
  type: string;
  member_ids?: string[];
  metadata?: Record<string, any>;
}

/**
 * Get notifications for the current user
 */
export const getNotifications = async (
  limit: number = 50,
  offset: number = 0,
  unreadOnly: boolean = false
): Promise<Notification[]> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const params = new URLSearchParams({
    limit: limit.toString(),
    offset: offset.toString(),
    unread_only: unreadOnly.toString(),
  });

  const response = await fetch(`${API_URL}/notifications?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch notifications');
  }

  return await response.json();
};

/**
 * Get count of unread notifications
 */
export const getUnreadCount = async (): Promise<NotificationCount> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/notifications/count`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch notification count');
  }

  return await response.json();
};

/**
 * Mark specific notifications as read
 */
export const markNotificationsRead = async (notificationIds: string[]): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/notifications/mark-read`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ notification_ids: notificationIds }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to mark notifications as read');
  }
};

/**
 * Mark all notifications as read
 */
export const markAllNotificationsRead = async (): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to mark all notifications as read');
  }
};

/**
 * Delete a specific notification
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete notification');
  }
};

/**
 * Clear all notifications
 */
export const clearAllNotifications = async (): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/notifications`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to clear all notifications');
  }
};

/**
 * Create a new notification (admin/manager only)
 */
export const createNotification = async (
  notificationData: CreateNotificationRequest
): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/notifications/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(notificationData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create notification');
  }
};

/**
 * Format notification time for display
 */
export const formatNotificationTime = (createdAt: string): string => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now.getTime() - created.getTime();
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
    return created.toLocaleDateString();
  }
};

/**
 * Get notification icon based on type
 */
export const getNotificationIcon = (type: string): string => {
  switch (type) {
    case 'order':
      return '📦';
    case 'customer':
      return '👤';
    case 'team':
      return '👥';
    case 'security':
      return '🔒';
    case 'system':
    default:
      return '⚙️';
  }
}; 