// Shared types for the Truck Loading Helper components

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  orders: Order[];
  autoEmailRecipients?: AutoEmailRecipient[];
}

export interface Order {
  id: string;
  name: string;
  status: 'pending' | 'loaded' | 'delivered';
  receipt?: CustomerOrderReceipt;
}

export interface CustomerOrderReceipt {
  order_id: string;
  customer_id: string;
  date_ordered: string;
  upcoming_shipments: string;
  order_details: OrderItem[];
  order_pdf_link: string;
  loading_instructions?: LoadingInstructions;
}

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
}

export interface LoadingInstructions {
  truck_type: string;
  visual_model_url: string;
  verbal: string;
  special_notes?: string;
}

export interface AutoEmailRecipient {
  id: string;
  email: string;
  name?: string;
  notificationTypes: string[];
}
