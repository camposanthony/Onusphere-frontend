const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
import { getToken } from './auth';

interface UsageData {
  current_month_trucks: number;
  total_trucks_loaded: number;
  current_month_cost: number;
  total_spent: number;
  price_per_truck: number;
  payment_method_connected: boolean;
  last_payment_date: number | null;
  next_billing_date: number | null;
}

interface TruckCredits {
  total_trucks_purchased: number;
  total_spent: number;
  available_credits: number;
  price_per_truck: number;
}

interface PaymentHistory {
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
    trucks_purchased: string | number;
    description: string;
    period_start?: number;
    period_end?: number;
  }>;
}

interface CheckoutSession {
  checkout_url: string;
  session_id: string;
  customer_id?: string;
}

interface PortalSession {
  portal_url: string;
}

interface UsageRecord {
  trucks_used: number;
  date_used: string;
  description?: string;
}

/**
 * Setup payment method for monthly billing
 */
export const setupPaymentMethod = async (): Promise<CheckoutSession> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/payment/setup-payment-method`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      quantity: 1, // Minimal for setup
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to setup payment method');
  }

  return await response.json();
};

/**
 * Record truck usage for billing
 */
export const recordUsage = async (trucksUsed: number, dateUsed?: string): Promise<{status: string, trucks_recorded: number}> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const usageDate = dateUsed || new Date().toISOString().split('T')[0];

  const response = await fetch(`${API_URL}/payment/record-usage`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      trucks_used: trucksUsed,
      date_used: usageDate,
      description: `Load Plan Pro usage - ${trucksUsed} trucks`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to record usage');
  }

  return await response.json();
};

/**
 * Get current usage data and billing information
 */
export const getUsageData = async (): Promise<UsageData> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/payment/usage-data`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch usage data');
  }

  return await response.json();
};

/**
 * Disconnect payment method
 */
export const disconnectPaymentMethod = async (): Promise<{status: string, message: string}> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/payment/disconnect-payment-method`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to disconnect payment method');
  }

  return await response.json();
};

/**
 * Create a Stripe billing portal session
 */
export const createPortalSession = async (customerId?: string): Promise<PortalSession> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/payment/create-portal-session`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customer_id: customerId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to create portal session');
  }

  return await response.json();
};

/**
 * Get payment/billing history for the current user
 */
export const getPaymentHistory = async (): Promise<PaymentHistory> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/payment/payment-history`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch payment history');
  }

  return await response.json();
};

// Backward compatibility functions

/**
 * Legacy: Create a Stripe checkout session (now redirects to payment method setup)
 */
export const createCheckoutSession = async (quantity: number = 1): Promise<CheckoutSession> => {
  return await setupPaymentMethod();
};

/**
 * Legacy: Get user's truck credits (now returns usage data in compatible format)
 */
export const getTruckCredits = async (): Promise<TruckCredits> => {
  const token = getToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(`${API_URL}/payment/truck-credits`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || 'Failed to fetch truck credits');
  }

  return await response.json();
};

// Helper functions

/**
 * Helper function to redirect to Stripe Checkout for payment method setup
 */
export const redirectToCheckout = async (quantity: number = 1): Promise<void> => {
  try {
    const session = await setupPaymentMethod();
    window.location.href = session.checkout_url;
  } catch (error) {
    console.error('Error redirecting to checkout:', error);
    throw error;
  }
};

/**
 * Helper function to redirect to Stripe billing portal
 */
export const redirectToBillingPortal = async (customerId?: string): Promise<void> => {
  try {
    const portal = await createPortalSession(customerId);
    window.location.href = portal.portal_url;
  } catch (error) {
    console.error('Error redirecting to billing portal:', error);
    throw error;
  }
}; 