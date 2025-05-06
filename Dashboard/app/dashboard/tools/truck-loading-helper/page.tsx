'use client';

import { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Search,
  Mail,
  ShoppingCart,
  Package,
  Clock,
  CheckCircle2,
  Loader2,
  UserPlus,
  RefreshCw,
  Filter,
  ArrowRight,
  Send,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// Mock data for customers
interface Customer {
  id: string;
  name: string;
  location: string;
  ordersCount: number;
  pendingOrders: number;
}

// Mock data for orders
interface Order {
  id: string;
  customer: string;
  customerId: string;
  products: string[];
  status: 'pending' | 'loaded' | 'delivered';
  date: string;
  priority: 'low' | 'medium' | 'high';
}

const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Acme Corporation', location: 'New York, NY', ordersCount: 12, pendingOrders: 3 },
  { id: 'c2', name: 'TechNova Industries', location: 'San Francisco, CA', ordersCount: 8, pendingOrders: 2 },
  { id: 'c3', name: 'Global Shipping Co.', location: 'Miami, FL', ordersCount: 15, pendingOrders: 4 },
  { id: 'c4', name: 'EastCoast Distributors', location: 'Boston, MA', ordersCount: 6, pendingOrders: 1 },
  { id: 'c5', name: 'Midwest Supplies', location: 'Chicago, IL', ordersCount: 10, pendingOrders: 0 },
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
];

export default function TruckLoadingHelper() {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showEmailInstructions, setShowEmailInstructions] = useState(true);
  
  // In a real app, this would be determined by API response
  const [hasCustomers, setHasCustomers] = useState(false);

  // Filter customers based on search query
  const filteredCustomers = mockCustomers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter orders based on search query and status
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Handle refresh button - simulating data refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      // Simulate receiving data after a refresh
      setHasCustomers(true);
    }, 1000);
  };
  
  // Simulate user forwarding email and system processing it
  const handleEmailForwarded = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setHasCustomers(true);
      setShowEmailInstructions(false);
    }, 1500);
  };

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

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Truck Loading Helper</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage customers and their orders for efficient truck loading
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            {refreshing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Mail className="mr-2 h-4 w-4" />
            View Email Instructions
          </Button>
        </div>
      </div>

      {showEmailInstructions && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-lg font-semibold">Email Workflow</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Forward order emails to <strong>orders@onusphere.com</strong> and they'll automatically appear in the respective customer's account within 5 minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                <Mail className="h-6 w-6 text-blue-700 dark:text-blue-300" />
              </div>
              <div>
                <h3 className="font-medium">Automatic Order Processing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">No need for manual data entry</p>
              </div>
            </div>
            <Button onClick={() => setShowEmailInstructions(false)}>
              Got it
            </Button>
          </div>
        </div>
      )}

      {!hasCustomers && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Info className="h-6 w-6 text-blue-700 dark:text-blue-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Get Started with Email Forwarding</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                You don't have any customers yet. To get started, forward your first order email to <strong>orders@onusphere.com</strong>. 
                Our system will automatically process the email and create a customer record with the order information.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" onClick={handleEmailForwarded}>
                  <Send className="mr-2 h-4 w-4" />
                  I've Forwarded an Email
                </Button>
                <Button variant="secondary">
                  <Mail className="mr-2 h-4 w-4" />
                  View Email Instructions
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="customers" className="mb-6" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <TabsList>
            <TabsTrigger value="customers">Customers</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-2">
            {activeTab === 'customers' ? (
              <Button size="sm">
                <UserPlus className="mr-2 h-4 w-4" />
                Add New Customer
              </Button>
            ) : (
              <>
                <Select>
                  <select 
                    className="h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="loaded">Loaded</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </Select>
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Manual Order
                </Button>
              </>
            )}
          </div>
        </div>
        
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={activeTab === 'customers' ? "Search customers..." : "Search orders..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <TabsContent value="customers" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead>Pending Orders</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow key={customer.id} className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" onClick={() => window.location.href = `/dashboard/tools/truck-loading-helper/customer/${customer.id}`}>
                      <TableCell className="font-medium">{customer.name}</TableCell>
                      <TableCell>{customer.location}</TableCell>
                      <TableCell>{customer.ordersCount}</TableCell>
                      <TableCell>
                        {customer.pendingOrders > 0 ? (
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                            {customer.pendingOrders} Pending
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                            None Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/tools/truck-loading-helper/customer/${customer.id}`}>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            View
                            <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {!hasCustomers ? (
                <div className="py-12 text-center">
                  <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No customers yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Forward your first order email to <strong>orders@onusphere.com</strong> to get started
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline" onClick={handleEmailForwarded}>
                      <Send className="mr-2 h-4 w-4" />
                      I've Forwarded an Email
                    </Button>
                    <Button>
                      <Mail className="mr-2 h-4 w-4" />
                      View Email Instructions
                    </Button>
                  </div>
                </div>
              ) : filteredCustomers.length === 0 && (
                <div className="py-12 text-center">
                  <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No customers found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No customers match your search criteria</p>
                  <Button onClick={() => setSearchQuery('')}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Clear Search
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="orders" className="mt-0">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Products</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.customer}</TableCell>
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
              
              {filteredOrders.length === 0 && (
                <div className="py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No orders found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try adjusting your filters or add a new order
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <Button variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Forward Order Email
                    </Button>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Manual Order
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
