/**
 * API client specifically for Truck Loading Helper
 */
import { authGet, authPost, authPut, API_BASE_URL } from '../utils/api';

export interface Customer {
  id: string;
  name: string;
  location: string;
  ordersCount: number;
  pendingOrders: number;
}

export interface Order {
  id: string;
  customer: string;
  customerId: string;
  products: string[];
  status: 'pending' | 'loaded' | 'delivered';
  date: string;
  priority: 'low' | 'medium' | 'high';
  loadingInstructions?: {
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
 * Get all orders
 */
export const getOrders = (): Promise<Order[]> => {
  return authGet<Order[]>('/orders');
};

/**
 * Get order by ID
 */
export const getOrderById = (id: string): Promise<Order> => {
  return authGet<Order>(`/orders/${id}`);
};

/**
 * Update order status
 */
export const updateOrderStatus = (id: string, status: 'pending' | 'loaded' | 'delivered'): Promise<Order> => {
  return authPut<Order>(`/orders/${id}/status`, { status });
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
