'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Truck,
  Package,
  ShoppingBag,
  Mail,
  Calendar,
  MapPin,
  Phone,
  Loader2,
  FileText,
  ClipboardList,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

// Types from the main page
interface Customer {
  id: string;
  name: string;
  location: string;
  ordersCount: number;
  pendingOrders: number;
  email?: string;
  phone?: string;
  address?: string;
}

interface Order {
  id: string;
  customer: string;
  customerId: string;
  products: string[];
  status: 'pending' | 'loaded' | 'delivered';
  date: string;
  priority: 'low' | 'medium' | 'high';
}

// Additional type for the master list of items
interface ItemHistoryEntry {
  id: string;
  name: string;
  quantity: number;
  lastOrdered: string;
  orderId: string;
  orderFrequency: 'frequent' | 'occasional' | 'rare';
  status: 'active' | 'discontinued';
}

// Mock data - in a real app this would come from an API
const mockCustomers: Customer[] = [
  { 
    id: 'c1', 
    name: 'Acme Corporation', 
    location: 'New York, NY', 
    ordersCount: 12, 
    pendingOrders: 3,
    email: 'orders@acmecorp.com',
    phone: '(212) 555-1234',
    address: '123 Broadway, New York, NY 10001'
  },
  { 
    id: 'c2', 
    name: 'TechNova Industries', 
    location: 'San Francisco, CA', 
    ordersCount: 8, 
    pendingOrders: 2,
    email: 'shipping@technova.com',
    phone: '(415) 555-6789',
    address: '456 Market St, San Francisco, CA 94105'
  },
  { 
    id: 'c3', 
    name: 'Global Shipping Co.', 
    location: 'Miami, FL', 
    ordersCount: 15, 
    pendingOrders: 4,
    email: 'logistics@globalship.com',
    phone: '(305) 555-4321',
    address: '789 Port Blvd, Miami, FL 33132'
  },
  { 
    id: 'c4', 
    name: 'EastCoast Distributors', 
    location: 'Boston, MA', 
    ordersCount: 6, 
    pendingOrders: 1,
    email: 'orders@eastcoast.com',
    phone: '(617) 555-8765',
    address: '321 Harbor Dr, Boston, MA 02210'
  },
  { 
    id: 'c5', 
    name: 'Midwest Supplies', 
    location: 'Chicago, IL', 
    ordersCount: 10, 
    pendingOrders: 0,
    email: 'purchasing@midwest.com',
    phone: '(312) 555-9876',
    address: '654 Lake St, Chicago, IL 60601'
  },
];

const mockOrders: Order[] = [
  { 
    id: 'o1', 
    customer: 'Acme Corporation', 
    customerId: 'c1',
    products: ['Industrial Widgets (50)', 'Machine Parts (25)'], 
    status: 'pending', 
    date: '2025-05-02', 
    priority: 'high' 
  },
  { 
    id: 'o2', 
    customer: 'Acme Corporation', 
    customerId: 'c1',
    products: ['Assembly Kits (30)'], 
    status: 'loaded', 
    date: '2025-05-04', 
    priority: 'medium' 
  },
  { 
    id: 'o3', 
    customer: 'TechNova Industries', 
    customerId: 'c2',
    products: ['Server Racks (10)', 'Network Cables (100)'], 
    status: 'pending', 
    date: '2025-05-05', 
    priority: 'medium' 
  },
  { 
    id: 'o4', 
    customer: 'Global Shipping Co.', 
    customerId: 'c3',
    products: ['Shipping Containers (5)', 'Packing Materials (200)'], 
    status: 'delivered', 
    date: '2025-05-01', 
    priority: 'low' 
  },
  { 
    id: 'o5', 
    customer: 'Acme Corporation', 
    customerId: 'c1',
    products: ['Industrial Widgets (25)', 'Fasteners (100)'], 
    status: 'delivered', 
    date: '2025-04-28', 
    priority: 'medium' 
  },
  { 
    id: 'o6', 
    customer: 'Acme Corporation', 
    customerId: 'c1',
    products: ['Machine Parts (15)', 'Assembly Kits (10)'], 
    status: 'delivered', 
    date: '2025-04-25', 
    priority: 'low' 
  },
];

// Mock item history data
const mockItemHistory: Record<string, ItemHistoryEntry[]> = {
  'c1': [
    {
      id: 'i1',
      name: 'Industrial Widgets',
      quantity: 75,
      lastOrdered: '2025-05-02',
      orderId: 'o1',
      orderFrequency: 'frequent',
      status: 'active'
    },
    {
      id: 'i2',
      name: 'Machine Parts',
      quantity: 40,
      lastOrdered: '2025-05-02',
      orderId: 'o1',
      orderFrequency: 'frequent',
      status: 'active'
    },
    {
      id: 'i3',
      name: 'Assembly Kits',
      quantity: 40,
      lastOrdered: '2025-05-04',
      orderId: 'o2',
      orderFrequency: 'occasional',
      status: 'active'
    },
    {
      id: 'i4',
      name: 'Fasteners',
      quantity: 100,
      lastOrdered: '2025-04-28',
      orderId: 'o5',
      orderFrequency: 'occasional',
      status: 'active'
    },
    {
      id: 'i5',
      name: 'Control Panels',
      quantity: 5,
      lastOrdered: '2025-03-15',
      orderId: 'older-order',
      orderFrequency: 'rare',
      status: 'discontinued'
    }
  ],
  'c2': [
    {
      id: 'i6',
      name: 'Server Racks',
      quantity: 10,
      lastOrdered: '2025-05-05',
      orderId: 'o3',
      orderFrequency: 'occasional',
      status: 'active'
    },
    {
      id: 'i7',
      name: 'Network Cables',
      quantity: 100,
      lastOrdered: '2025-05-05',
      orderId: 'o3',
      orderFrequency: 'frequent',
      status: 'active'
    }
  ],
  'c3': [
    {
      id: 'i8',
      name: 'Shipping Containers',
      quantity: 5,
      lastOrdered: '2025-05-01',
      orderId: 'o4',
      orderFrequency: 'rare',
      status: 'active'
    },
    {
      id: 'i9',
      name: 'Packing Materials',
      quantity: 200,
      lastOrdered: '2025-05-01',
      orderId: 'o4',
      orderFrequency: 'frequent',
      status: 'active'
    }
  ]
};

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [itemHistory, setItemHistory] = useState<ItemHistoryEntry[]>([]);
  const [activeTab, setActiveTab] = useState('orders');
  
  useEffect(() => {
    const customerId = params.id as string;
    
    // In a real app, these would be API calls
    const foundCustomer = mockCustomers.find(c => c.id === customerId) || null;
    const customerOrders = mockOrders.filter(order => order.customerId === customerId);
    const customerItems = mockItemHistory[customerId] || [];
    
    // Simulate loading
    const timer = setTimeout(() => {
      setCustomer(foundCustomer);
      setCustomerOrders(customerOrders);
      setItemHistory(customerItems);
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [params.id]);
  
  // Status badge colors
  const getStatusBadge = (status: 'pending' | 'loaded' | 'delivered') => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'loaded':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Loaded</Badge>;
      case 'delivered':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Delivered</Badge>;
    }
  };
  
  // Priority badge colors
  const getPriorityBadge = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return <Badge variant="outline" className="border-gray-400 text-gray-600">Low</Badge>;
      case 'medium':
        return <Badge variant="outline" className="border-blue-400 text-blue-600">Medium</Badge>;
      case 'high':
        return <Badge variant="outline" className="border-red-400 text-red-600">High</Badge>;
    }
  };
  
  // Item frequency badge
  const getFrequencyBadge = (frequency: 'frequent' | 'occasional' | 'rare') => {
    switch (frequency) {
      case 'frequent':
        return <Badge variant="outline" className="border-green-400 text-green-600">Frequent</Badge>;
      case 'occasional':
        return <Badge variant="outline" className="border-blue-400 text-blue-600">Occasional</Badge>;
      case 'rare':
        return <Badge variant="outline" className="border-gray-400 text-gray-600">Rare</Badge>;
    }
  };
  
  // Item status badge
  const getItemStatusBadge = (status: 'active' | 'discontinued') => {
    switch (status) {
      case 'active':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>;
      case 'discontinued':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Discontinued</Badge>;
    }
  };
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6 flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <h3 className="text-lg font-medium text-gray-600">Loading customer data...</h3>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to all customers
          </Button>
        </div>
        <div className="py-12 text-center bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <AlertCircle className="mx-auto h-16 w-16 text-red-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">Customer not found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            The customer you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/dashboard/tools/truck-loading-helper">
            <Button>
              Return to Truck Loading Helper
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to all customers
        </Button>
      </div>
      
      {/* Customer Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Truck className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{customer.name}</h1>
              <div className="text-gray-600 dark:text-gray-300 flex items-center mt-1">
                <MapPin className="h-4 w-4 mr-1" />
                {customer.location}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              Email Customer
            </Button>
            <Button variant="outline" size="sm">
              <FileText className="mr-2 h-4 w-4" />
              View Details
            </Button>
            <Button size="sm">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add Order
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Contact Email</div>
            <div className="font-medium mt-1">{customer.email || 'N/A'}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Phone Number</div>
            <div className="font-medium mt-1">{customer.phone || 'N/A'}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Orders</div>
            <div className="font-medium mt-1">
              {customer.ordersCount} orders ({customer.pendingOrders} pending)
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs for Orders and Item History */}
      <Tabs defaultValue="orders" className="mb-6" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Current Orders</TabsTrigger>
          <TabsTrigger value="item-history">Item History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Orders</CardTitle>
              <CardDescription>
                All orders for {customer.name}, sorted by most recent
              </CardDescription>
            </CardHeader>
            <CardContent>
              {customerOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Products</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            {order.products.map((product, index) => (
                              <div key={index} className="text-sm">{product}</div>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                        <TableCell>{getStatusBadge(order.status)}</TableCell>
                        <TableCell>{getPriorityBadge(order.priority)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                          <Button variant="ghost" size="sm">Update</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No orders found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    This customer hasn't placed any orders yet
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Forward Order Email
                    </Button>
                    <Button>
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add New Order
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="item-history" className="mt-0">
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-xl">Item History</CardTitle>
              <CardDescription>
                Master list of all items ordered by {customer.name} in the past
              </CardDescription>
            </CardHeader>
            <CardContent>
              {itemHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Total Quantity</TableHead>
                      <TableHead>Last Ordered</TableHead>
                      <TableHead>Order Pattern</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemHistory.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                            {item.lastOrdered}
                          </div>
                        </TableCell>
                        <TableCell>{getFrequencyBadge(item.orderFrequency)}</TableCell>
                        <TableCell>{getItemStatusBadge(item.status)}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            View History
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="py-12 text-center">
                  <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No item history found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    This customer hasn't ordered any items yet
                  </p>
                  <Button>
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Add First Order
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
