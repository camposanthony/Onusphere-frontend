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

export interface EmailTemplate {
  to: string;
  subject: string;
  body: string;
}

export interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'manager' | 'member';
  message?: string;
  date_created: string;
  expires_at: string;
  status: 'pending' | 'accepted' | 'expired';
  invited_by: string;
  email_template?: EmailTemplate;
}

export interface SendInvitationData {
  email: string;
  role: 'admin' | 'manager' | 'member';
  message?: string;
}

/**
 * Create a mailto link from email template data
 */
export const createMailtoLink = (template: EmailTemplate): string => {
  const params = new URLSearchParams({
    to: template.to,
    subject: template.subject,
    body: template.body,
  });
  return `mailto:?${params.toString()}`;
};

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
 * Get all pending invitations for the current account
 */
export const getPendingInvitations = async (): Promise<Invitation[]> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/invitations`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch invitations');
  }

  return await response.json();
};

/**
 * Send an invitation to a new team member
 */
export const sendInvitation = async (invitationData: SendInvitationData): Promise<Invitation> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/invitations/send`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(invitationData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to send invitation');
  }

  return await response.json();
};

/**
 * Resend an existing invitation
 */
export const resendInvitation = async (invitationId: string): Promise<Invitation> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/invitations/resend`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ invitation_id: invitationId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to resend invitation');
  }

  return await response.json();
};

/**
 * Delete/cancel an invitation
 */
export const deleteInvitation = async (invitationId: string): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/invitations/${invitationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to delete invitation');
  }
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

export async function getCompanyCode(): Promise<string | null> {
  try {
    const token = getToken();
    if (!token) {
      // Handle not authenticated case, perhaps throw an error or return null
      // depending on how you want to manage this scenario.
      // For now, let's log and return null, consistent with the catch block.
      console.error('Not authenticated: Cannot fetch company code.');
      return null;
    }

    const response = await fetch(`${API_URL}/account/settings`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }); 
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      console.error('Failed to fetch company settings:', errorData.detail);
      throw new Error(`Failed to fetch company settings: ${errorData.detail}`);
    }
    const data = await response.json();
    return data.company_code || null;
  } catch (error) {
    console.error('Error fetching company code:', error);
    return null;
  }
}