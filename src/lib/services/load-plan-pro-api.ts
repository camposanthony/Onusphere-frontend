/**
 * API client specifically for Load Plan Pro
 */
import { authGet, authPost, authPut, API_BASE_URL } from "../utils/api";

export interface Customer {
  id: string;
  name: string;
  email_domain: string;
  incompleteOrderCount: number;
}

export interface CreateCustomerPayload {
  name: string;
  email_domain: string;
}

// For the "add customer via email" workflow, what the frontend page expects
export interface FrontendOrderItem {
  id: string; // Corresponds to item_id
  name: string; // Corresponds to item_number or description
  quantity: number; // Needs to be sourced
  length: number | null;
  width: number | null;
  height: number | null;
}

export interface FrontendOrder {
  id: string; // Order ID
  customerName: string; // Potentially derived
  // Status for the email processing workflow
  status:
    | "pending_email_processing"
    | "incomplete_dimensions"
    | "processing"
    | "complete";
  items: FrontendOrderItem[];
  createdAt: string; // Or Date
}

// For fetchMissingOrderItems - closer to backend structure
export interface BackendOrderItemDimension {
  item_id: string;
  item_number: string;
  description?: string;
  length: number; // Backend sends 0 for not set
  width: number; // Backend sends 0 for not set
  height: number; // Backend sends 0 for not set
}

export interface MissingItemsResponse {
  // Expected wrapper for fetchMissingOrderItems if backend sends it
  order_id: string;
  missing_items: BackendOrderItemDimension[];
}

// For updateItemDimensionsBatch payload
export interface UpdateItemDimensionsRequest {
  [key: string]: number;
  length: number;
  width: number;
  height: number;
}

// Renamed from existing Order, represents raw structure from general order endpoints
export interface BackendOrderBatchItem {
  item_id: string;
  item_number: string;
  description: string;
  units_per_pallet: number;
}
export interface BackendOrderBatch {
  order_batch_id: string;
  number_pallets: number;
  item: BackendOrderBatchItem | null;
}
export interface LoadingInstructions {
  sequence: string[];
  notes: string;
  vehicleType: string;
  estimatedTime: string;
}

export interface BackendOrder {
  // Renamed from original Order interface
  id: string;
  // Assuming 'items' should be 'order_batches' to match backend serialization
  order_batches: BackendOrderBatch[];
  order_date: string;
  // Assuming 'upcoming_shipment_times' should be 'shipment_times'
  shipment_times: string[];
  status: "incomplete" | "processing" | "done"; // General order lifecycle status
  loading_instructions: LoadingInstructions | []; // Match backend which can be empty list
}

/**
 * Get all customers
 */
export const getCustomers = (): Promise<Customer[]> => {
  return authGet<Customer[]>("/customer/");
};

/**
 * Get customer by ID
 */
export const getCustomerById = (id: string): Promise<Customer> => {
  return authGet<Customer>(`/customer/${id}`);
};

/**
 * Get orders for a customer
 */
export const getCustomerOrders = (
  customerId: string,
): Promise<BackendOrder[]> => {
  return authGet<BackendOrder[]>(`/customer/${customerId}/orders`);
};

/**
 * Update order status
 * Note: Ensure a corresponding PUT endpoint exists on the backend, e.g., /customer/orders/{order_id}/status
 */
export const updateOrderStatus = (
  orderId: string,
  status: "incomplete" | "processing" | "done",
): Promise<BackendOrder> => {
  return authPut<BackendOrder>(`/customer/orders/${orderId}/status`, {
    status,
  });
};

/**
 * Response type for email processing pipeline trigger
 */
export interface EmailProcessingResponse {
  success: boolean;
  message?: string;
  orderId?: string;
  [key: string]: unknown; // For any additional backend fields
}

/**
 * Request payload for triggering email processing
 */
export interface EmailProcessingPayload {
  email: string;
  subject?: string;
  body?: string;
  attachments?: Array<{ filename: string; content: string }>;
  [key: string]: unknown; // For any additional backend fields
}

/**
 * Trigger the email processing pipeline
 * This simulates the email processing that would happen on the backend
 */
export const triggerEmailProcessing = (
  emailData?: EmailProcessingPayload,
): Promise<EmailProcessingResponse> => {
  return authPost<EmailProcessingResponse>("/email-trigger", emailData || {});
};

/**
 * Response type for last pipeline result
 */
export interface PipelineResult {
  status: "pending" | "processing" | "complete" | "failed";
  orderId?: string;
  details?: string;
  [key: string]: unknown; // For any additional backend fields
}

/**
 * Get the last pipeline result
 */
export const getLastPipelineResult = (): Promise<PipelineResult> => {
  return authGet<PipelineResult>("/result");
};

/**
 * Create a test order (for development only)
 */
export const createTestOrder = (): Promise<BackendOrder> => {
  // Assuming it returns BackendOrder structure
  return authPost<BackendOrder>("/testing/create-test-order", {});
};

export const createCustomer = async (
  payload: CreateCustomerPayload,
): Promise<Customer> => {
  const response = await fetch(`${API_BASE_URL}/customer/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Consider adding Authorization header if needed, like authPost does
    },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Failed to create customer");
  }
  return response.json();
};

/**
 * Update item dimensions
 */
export interface UpdateItemDimensionsResponse {
  success: boolean;
  message?: string;
  [key: string]: unknown;
}

export const updateItemDimensions = (
  itemId: string,
  payload: UpdateItemDimensionsRequest,
): Promise<UpdateItemDimensionsResponse> => {
  return authPost<UpdateItemDimensionsResponse>(
    `/item/${itemId}/update`,
    payload,
  );
};
