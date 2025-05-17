/**
 * API client specifically for Load Plan Pro
 */
import { authGet, authPost, authPut, API_BASE_URL } from '../utils/api';

export interface Customer {
  id: string;
  name: string;
  email_domain: string;
}

export interface Order {
  id: string;
  items: {
    item_id: string;
    number_pallets: number;
  }[];
  order_date: string;
  upcoming_shipment_times: string[];
  status: 'pending' | 'loaded' | 'delivered';
  loading_instructions: {
    sequence: string[];
    notes: string;
    vehicleType: string;
    estimatedTime: string;
  };
}

/**
 * Get all customers
 */
export const getCustomers = (): Promise<Customer[]> => {
  return authGet<Customer[]>('/customers');
};

/**
 * Get customer by ID
 */
export const getCustomerById = (id: string): Promise<Customer> => {
  return authGet<Customer>(`/customers/${id}`);
};

/**
 * Get orders for a customer
 */
export const getCustomerOrders = (customerId: string): Promise<Order[]> => {
  return authGet<Order[]>(`/customers/${customerId}/orders`);
};

/**
 * Update order status
 */
export const updateOrderStatus = (id: string, status: 'pending' | 'loaded' | 'delivered'): Promise<Order> => {
  return authPut<Order>(`/customers/orders/${id}/status`, { status });
};

/**
 * Trigger the email processing pipeline
 * This simulates the email processing that would happen on the backend
 */
export const triggerEmailProcessing = (emailData?: any): Promise<any> => {
  return authPost<any>('/email-trigger', emailData || {});
};

/**
 * Get the last pipeline result
 */
export const getLastPipelineResult = (): Promise<any> => {
  return authGet<any>('/result');
};

/**
 * Create a test order (for development only)
 */
export const createTestOrder = (): Promise<Order> => {
  return authPost<Order>('/testing/create-test-order', {});
};

export async function createCustomer(customerData: { name: string; email_domain: string }): Promise<Customer> {
  return authPost<Customer>('/customers', customerData);
}
