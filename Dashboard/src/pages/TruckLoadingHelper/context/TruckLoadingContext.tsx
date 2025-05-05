import React, { createContext, useContext, useState, useReducer, ReactNode } from 'react';
import { Customer, Order, AutoEmailRecipient } from '../types';

// Define the state and context types
interface TruckLoadingState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  selectedOrder: Order | null;
  isOnboarding: boolean;
  isProcessingEmail: boolean;
  onboardingComplete: boolean;
}

interface TruckLoadingContextType extends TruckLoadingState {
  selectCustomer: (customer: Customer | null) => void;
  selectOrder: (order: Order | null) => void;
  addCustomer: (name: string, email: string, phone?: string, address?: string) => void;
  addOrder: (customerId: string, orderName: string) => void;
  updateOrderStatus: (customerId: string, orderId: string, status: 'pending' | 'loaded' | 'delivered') => void;
  addAutoEmailRecipient: (customerId: string, email: string, name: string, notificationTypes: string[]) => void;
  simulateEmailProcessing: () => void;
  resetOnboarding: () => void;
  completeOnboarding: () => void;
}

// Create the context
const TruckLoadingContext = createContext<TruckLoadingContextType | undefined>(undefined);

// Initial state with mock data
const initialState: TruckLoadingState = {
  customers: [
    {
      id: 'cust1',
      name: 'Acme Corporation',
      email: 'orders@acme.com',
      phone: '(555) 123-4567',
      address: '123 Main St, Anytown, USA',
      orders: [
        {
          id: 'order1',
          name: 'Office Supplies Order',
          status: 'pending',
          receipt: {
            order_id: 'INV-2023-001',
            customer_id: 'cust1',
            date_ordered: '2023-05-01',
            upcoming_shipments: '2023-05-15T10:00:00',
            order_details: [
              { product: 'Desk Chair', quantity: 5, price: 149.99 },
              { product: 'Notebooks', quantity: 20, price: 3.99 },
              { product: 'Pens (Box)', quantity: 10, price: 5.99 }
            ],
            order_pdf_link: 'https://example.com/invoice.pdf',
            loading_instructions: {
              truck_type: 'Box Truck - 24ft',
              visual_model_url: '/models/truck_box.glb',
              verbal: 'Load the chairs first against the back wall of the truck. Stack the boxes of pens and notebooks on top of each other in the remaining space. Ensure that the heaviest items are at the bottom for stability.',
              special_notes: 'The chairs are slightly fragile. Make sure to secure them properly to prevent damage during transit.'
            }
          }
        },
        {
          id: 'order2',
          name: 'Computer Equipment Order',
          status: 'loaded',
          receipt: {
            order_id: 'INV-2023-002',
            customer_id: 'cust1',
            date_ordered: '2023-05-05',
            upcoming_shipments: '2023-05-20T14:00:00',
            order_details: [
              { product: 'Laptop Computers', quantity: 10, price: 999.99 },
              { product: 'Monitors', quantity: 15, price: 249.99 },
              { product: 'Docking Stations', quantity: 10, price: 129.99 }
            ],
            order_pdf_link: 'https://example.com/invoice2.pdf',
            loading_instructions: {
              truck_type: 'Van - Medium',
              visual_model_url: '/models/truck_van.glb',
              verbal: 'Place the monitor boxes along the left side of the van, stacked no more than 3 high. Position laptop boxes on the right side, also stacked no more than 3 high. Put docking stations in the remaining space at the front of the van.',
              special_notes: 'Electronic equipment must be kept dry at all times. Ensure van is completely watertight before loading.'
            }
          }
        }
      ],
      autoEmailRecipients: [
        {
          id: 'recipient1',
          email: 'warehouse@acme.com',
          name: 'Acme Warehouse',
          notificationTypes: ['loading-instructions', 'new-orders']
        }
      ]
    },
    {
      id: 'cust2',
      name: 'Global Industries',
      email: 'shipping@global-industries.com',
      phone: '(555) 987-6543',
      orders: [
        {
          id: 'order3',
          name: 'Industrial Equipment Order',
          status: 'delivered',
          receipt: {
            order_id: 'INV-2023-003',
            customer_id: 'cust2',
            date_ordered: '2023-04-20',
            upcoming_shipments: '2023-05-10T09:00:00',
            order_details: [
              { product: 'Industrial Pump', quantity: 2, price: 1299.99 },
              { product: 'Control Panel', quantity: 1, price: 2499.99 },
              { product: 'Safety Equipment', quantity: 5, price: 99.99 }
            ],
            order_pdf_link: 'https://example.com/invoice3.pdf',
            loading_instructions: {
              truck_type: 'Flatbed Truck',
              visual_model_url: '/models/truck_flatbed.glb',
              verbal: 'Position the two industrial pumps in the center of the flatbed, with at least 2 feet of space between them. Secure with straps in an X pattern. Place the control panel crate at the front of the flatbed and secure separately. The safety equipment boxes can be placed in the remaining space and secured together.',
              special_notes: 'Each pump weighs 750 lbs and requires a forklift to load. The control panel is sensitive to vibration and should be loaded last with extra padding.'
            }
          }
        }
      ],
      autoEmailRecipients: []
    },
    {
      id: 'cust3',
      name: 'City Municipality',
      email: 'procurement@citymunicipality.gov',
      orders: []
    }
  ],
  selectedCustomer: null,
  selectedOrder: null,
  isOnboarding: true,
  isProcessingEmail: false,
  onboardingComplete: false,
};

// Provider component
export const TruckLoadingProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [state, setState] = useState<TruckLoadingState>(initialState);

  const selectCustomer = (customer: Customer | null) => {
    setState(prev => ({
      ...prev,
      selectedCustomer: customer,
      selectedOrder: null,
    }));
  };

  const selectOrder = (order: Order | null) => {
    setState(prev => ({
      ...prev,
      selectedOrder: order,
    }));
  };

  const addCustomer = (name: string, email: string, phone?: string, address?: string) => {
    const newCustomer: Customer = {
      id: `cust${Date.now()}`,
      name,
      email: email || undefined,
      phone,
      address,
      orders: []
    };
    setState(prev => ({
      ...prev,
      customers: [...prev.customers, newCustomer],
    }));
  };

  const addOrder = (customerId: string, orderName: string) => {
    setState(prev => {
      const updatedCustomers = prev.customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            orders: [
              ...customer.orders,
              {
                id: `order${Date.now()}`,
                name: orderName,
                status: 'pending' as const
              }
            ]
          };
        }
        return customer;
      });

      return {
        ...prev,
        customers: updatedCustomers
      };
    });
  };

  const updateOrderStatus = (customerId: string, orderId: string, status: 'pending' | 'loaded' | 'delivered') => {
    setState(prev => {
      const updatedCustomers = prev.customers.map(customer => {
        if (customer.id === customerId) {
          return {
            ...customer,
            orders: customer.orders.map(order => {
              if (order.id === orderId) {
                return { ...order, status };
              }
              return order;
            })
          };
        }
        return customer;
      });

      let updatedOrder = prev.selectedOrder;
      if (updatedOrder && updatedOrder.id === orderId) {
        updatedOrder = { ...updatedOrder, status };
      }

      return {
        ...prev,
        customers: updatedCustomers,
        selectedOrder: updatedOrder,
      };
    });
  };

  const addAutoEmailRecipient = (customerId: string, email: string, name: string, notificationTypes: string[]) => {
    setState(prev => {
      const updatedCustomers = prev.customers.map(customer => {
        if (customer.id === customerId) {
          const newRecipient: AutoEmailRecipient = {
            id: `recipient${Date.now()}`,
            email,
            name: name || undefined,
            notificationTypes
          };
          return {
            ...customer,
            autoEmailRecipients: [...(customer.autoEmailRecipients || []), newRecipient]
          };
        }
        return customer;
      });

      return {
        ...prev,
        customers: updatedCustomers
      };
    });
  };

  const simulateEmailProcessing = () => {
    setState(prev => ({
      ...prev,
      isProcessingEmail: true
    }));
    
    // Simulate email processing delay
    setTimeout(() => {
      // Create a new demo customer with an order
      const demoCustomer: Customer = {
        id: `demo-cust${Date.now()}`,
        name: 'Acme Manufacturing',
        email: 'orders@acme-manufacturing.com',
        phone: '(555) 789-1234',
        address: '456 Industry Way, Anytown, USA',
        orders: [
          {
            id: `order${Date.now()}`,
            name: 'Equipment Order #INV-2025-001',
            status: 'pending',
            receipt: {
              order_id: 'INV-2025-001',
              customer_id: `demo-cust${Date.now()}`,
              date_ordered: new Date().toISOString().split('T')[0],
              upcoming_shipments: (() => {
                const date = new Date();
                date.setDate(date.getDate() + 10);
                return date.toISOString();
              })(),
              order_details: [
                { product: 'Industrial Machinery', quantity: 2, price: 3499.99 },
                { product: 'Safety Equipment', quantity: 10, price: 99.99 },
                { product: 'Installation Kit', quantity: 2, price: 249.99 }
              ],
              order_pdf_link: '#',
              loading_instructions: {
                truck_type: 'Box Truck - 24ft',
                visual_model_url: '/models/truck_box.glb',
                verbal: 'Position the industrial machinery at the back of the truck, secured with straps. Place safety equipment and installation kits in front, ensuring heavier items are at the bottom for stability.',
                special_notes: 'The machinery requires careful handling. Use a forklift for loading and unloading.'
              }
            }
          }
        ],
        autoEmailRecipients: []
      };

      setState(prev => ({
        ...prev,
        customers: [...prev.customers, demoCustomer],
        isProcessingEmail: false,
        onboardingComplete: true,
        selectedCustomer: demoCustomer
      }));
    }, 3000);
  };

  const resetOnboarding = () => {
    setState(prev => ({
      ...prev,
      isOnboarding: true,
      isProcessingEmail: false,
      onboardingComplete: false,
      selectedCustomer: null,
      selectedOrder: null
    }));
  };

  const completeOnboarding = () => {
    setState(prev => ({
      ...prev,
      isOnboarding: false
    }));
  };

  return (
    <TruckLoadingContext.Provider
      value={{
        ...state,
        selectCustomer,
        selectOrder,
        addCustomer,
        addOrder,
        updateOrderStatus,
        addAutoEmailRecipient,
        simulateEmailProcessing,
        resetOnboarding,
        completeOnboarding,
      }}
    >
      {children}
    </TruckLoadingContext.Provider>
  );
};

// Custom hook to use the context
export const useTruckLoading = () => {
  const context = useContext(TruckLoadingContext);
  if (context === undefined) {
    throw new Error('useTruckLoading must be used within a TruckLoadingProvider');
  }
  return context;
};
