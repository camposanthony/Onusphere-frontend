'use client';

import { useState, useEffect } from 'react';
import EmailOrderProcessor from '@/components/truck-loading/email-order-processor';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  Info,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

// TODO: Add to the steps to add an ID to the subject heading of the email that gets forwarded 
// so it works with emails that isnt the one registered with the acct.

// Data interfaces for customers and orders
interface Customer {
  id: string;
  name: string;
  location: string;
  ordersCount: number;
  pendingOrders: number;
}

interface Order {
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

// Empty arrays for customers and orders - we'll simulate adding them via email process
const emptyCustomers: Customer[] = [];
const emptyOrders: Order[] = [];

// Sample customer and order that will be created after email forwarding
const sampleCustomer: Customer = {
  id: 'c1',
  name: 'First Customer, Inc.',
  location: 'Chicago, IL',
  ordersCount: 1,
  pendingOrders: 1
};

const sampleOrder: Order = {
  id: 'o1',
  customer: 'First Customer, Inc.',
  customerId: 'c1',
  products: ['Product A (25)', 'Product B (10)'],
  status: 'pending',
  date: '2025-05-07',
  priority: 'medium',
  loadingInstructions: {
    sequence: [
      '1. Load Product B (10) at the front of the truck',
      '2. Secure with straps to prevent shifting',
      '3. Load Product A (25) behind Product B',
      '4. Ensure weight distribution is balanced'
    ],
    notes: 'Product A is fragile. Handle with care and avoid stacking.',
    vehicleType: 'Medium-duty truck (16ft)',
    estimatedTime: '45 minutes'
  }
};

export default function TruckLoadingHelper() {
  const [activeTab, setActiveTab] = useState('customers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);
  const [showEmailInstructions, setShowEmailInstructions] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  
  // State to track if the user has customers and manage the onboarding process
  const [hasCustomers, setHasCustomers] = useState(false);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  
  // State to store customers and orders
  const [customers, setCustomers] = useState<Customer[]>(emptyCustomers);
  const [orders, setOrders] = useState<Order[]>(emptyOrders);

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.products.some(product => product.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // State for tracking the email processing steps
  const [processingEmail, setProcessingEmail] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const processingSteps = [
    'Retrieving email content...',
    'Identifying customer information...',
    'Extracting order details...',
    'Analyzing product specifications...',
    'Calculating optimal loading sequence...',
    'Generating truck loading instructions...',
    'Optimizing for safety and efficiency...',
    'Finalizing loading plan...',
  ];

  // Handle refresh button - simulating data refresh
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      // No effect if no customers yet
      if (hasCustomers) {
        // In a real app, this would fetch the latest data
      }
    }, 1000);
  };
  
  // Simulate user forwarding email and system processing it with detailed steps
  const handleEmailForwarded = () => {
    setProcessingEmail(true);
    setProcessingStep(0);
    setRefreshing(true);
    setIsFirstVisit(false);
    
    // Simulate processing time with incremental steps to show progress
    const stepInterval = 700; // Time between steps in ms
    
    // Process each step with a delay to simulate real-time processing
    const processSteps = (currentStep: number) => {
      if (currentStep < processingSteps.length) {
        setProcessingStep(currentStep);
        setTimeout(() => processSteps(currentStep + 1), stepInterval);
      } else {
        // All steps complete, show the result
        setTimeout(() => {
          // Add the sample customer and order
          setCustomers([sampleCustomer]);
          setOrders([sampleOrder]);
          
          // Update UI state
          setProcessingEmail(false);
          setRefreshing(false);
          setHasCustomers(true);
          setShowEmailInstructions(false);
        }, stepInterval);
      }
    };
    
    // Start the processing sequence
    processSteps(0);
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
          <div className="w-[220px]">
            <EmailOrderProcessor />
          </div>
        </div>
      </div>

      {hasCustomers && showEmailInstructions && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
            <h2 className="text-lg font-semibold">Email Workflow</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Forward order emails to <strong>orders@onusphere.com</strong> with the customer ID in the subject line (format: "[CUSTOMER_ID] Original Subject") and they'll automatically appear in the respective customer's account within 5 minutes.
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

      {!hasCustomers && isFirstVisit && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col items-center text-center py-6">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Mail className="h-10 w-10 text-blue-700 dark:text-blue-300" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Welcome to Truck Loading Helper!</h2>
            <div className="max-w-xl">
              <h3 className="text-lg font-semibold mb-2">Add Your First Customer by Email</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-center mb-2">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-8 h-8 flex items-center justify-center">
                      <span className="font-semibold">1</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium mb-2">Forward Order Email</h4>
                </div>
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-center mb-2">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-8 h-8 flex items-center justify-center">
                      <span className="font-semibold">2</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium mb-2">Automatic Processing</h4>
                </div>
                <div className="border rounded-md p-4 bg-white dark:bg-gray-800">
                  <div className="flex justify-center mb-2">
                    <div className="rounded-full bg-blue-100 dark:bg-blue-900 w-8 h-8 flex items-center justify-center">
                      <span className="font-semibold">3</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium mb-2">Ready to Use</h4>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <div className="w-[220px]">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleEmailForwarded}>
                      <Send className="mr-2 h-4 w-4" />
                      I've Forwarded an Email
                    </Button>
                  </div>
                  <div className="w-[220px]">
                    <EmailOrderProcessor />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {!hasCustomers && !isFirstVisit && !processingEmail && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-full">
              <Clock className="h-6 w-6 text-yellow-700 dark:text-yellow-300" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-2">Processing Your Email</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                We're currently processing your forwarded email. This typically takes 3-5 minutes.<br />
                You'll see your first customer and their order appear here soon. Please refresh the page in a few minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Refresh Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {processingEmail && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
          <div className="flex flex-col items-center text-center">
            <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-full mb-4">
              <Loader2 className="h-8 w-8 text-blue-700 dark:text-blue-300 animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Processing Your Email</h3>
            <div className="max-w-md mb-6">
              <div className="relative pt-4">
                <div className="mb-6 h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300 ease-in-out" 
                    style={{ width: `${(processingStep / (processingSteps.length - 1)) * 100}%` }}
                  ></div>
                </div>
                <div className="h-16 flex items-center justify-center mb-2">
                  <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">                  
                    {processingSteps[processingStep]}
                  </p>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  Please wait while we extract and organize the information from your email.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Only show the tabs and database when not in first visit mode or when we have customers */}
      {(!isFirstVisit || hasCustomers) && (
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
                <Button size="sm" onClick={() => alert('Please select a customer to add an order')}>
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
                    <div className="w-[220px]">
                      <Button variant="outline" size="sm" className="w-full" onClick={handleEmailForwarded}>
                        <Send className="mr-2 h-4 w-4" />
                        I've Forwarded an Email
                      </Button>
                    </div>
                    <div className="w-[220px]">
                      <EmailOrderProcessor />
                    </div>
                  </div>
                </div>
              ) : filteredCustomers.length === 0 && (
                <div className="py-12 text-center">
                  <UserPlus className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No customers found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No customers match your search criteria</p>
                  <Button size="sm" onClick={() => setSearchQuery('')}>
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
                    <TableHead>Loading Instructions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order.id} className="group">
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
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 border-blue-200 dark:border-blue-800"
                              onClick={() => setSelectedOrder(order)}
                            >
                              <Truck className="mr-2 h-4 w-4 text-blue-600 dark:text-blue-400" />
                              View Loading Plan
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                              <DialogTitle className="flex items-center">
                                <Truck className="mr-2 h-5 w-5 text-blue-600" />
                                Truck Loading Instructions
                              </DialogTitle>
                              <DialogDescription>
                                Optimized loading plan for order {order.id} - {order.customer}
                              </DialogDescription>
                            </DialogHeader>
                            
                            <div className="mt-4 space-y-6">
                              {/* Vehicle Information */}
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
                                <h3 className="text-sm font-semibold mb-2">Recommended Vehicle</h3>
                                <div className="flex items-center">
                                  <Truck className="h-10 w-10 text-blue-600 dark:text-blue-400 mr-3" />
                                  <div>
                                    <p className="font-medium">{order.loadingInstructions?.vehicleType}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Est. loading time: {order.loadingInstructions?.estimatedTime}</p>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Loading Sequence */}
                              <div>
                                <h3 className="text-sm font-semibold mb-3">Loading Sequence</h3>
                                <div className="space-y-3">
                                  {order.loadingInstructions?.sequence.map((step, index) => (
                                    <div key={index} className="flex items-start">
                                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-0.5">
                                        <span className="text-xs font-semibold text-blue-800 dark:text-blue-300">{index + 1}</span>
                                      </div>
                                      <p className="text-sm">{step}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Special Notes */}
                              <div className="rounded-lg border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-4">
                                <h3 className="text-sm font-semibold flex items-center mb-2">
                                  <Info className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mr-2" />
                                  Special Notes
                                </h3>
                                <p className="text-sm">{order.loadingInstructions?.notes}</p>
                              </div>
                              
                              {/* Safety Reminder */}
                              <div className="border-t pt-4 dark:border-gray-700">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Remember to follow all safety protocols during loading. Ensure all items are properly secured before transport.
                                </p>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                      <TableCell className="text-right">
                        <Link href={`/dashboard/tools/truck-loading-helper/loading-plan/${order.id}`}>
                          <Button variant="ghost" size="sm" className="mr-1">
                            <Truck className="mr-1 h-4 w-4 text-blue-600" />
                            View Plan
                          </Button>
                        </Link>
                        <Button variant="ghost" size="sm">Update</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {!hasCustomers ? (
                <div className="py-12 text-center">
                  <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No orders yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Forward your first order email to <strong>orders@onusphere.com</strong> to get started
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <div className="w-[220px]">
                      <Button variant="outline" size="sm" className="w-full" onClick={handleEmailForwarded}>
                        <Send className="mr-2 h-4 w-4" />
                        I've Forwarded an Email
                      </Button>
                    </div>
                    <div className="w-[220px]">
                      <EmailOrderProcessor />
                    </div>
                  </div>
                </div>
              ) : filteredOrders.length === 0 && (
                <div className="py-12 text-center">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-1">No orders found</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Try adjusting your filters or forward a new order email
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <div className="w-[220px]">
                      <EmailOrderProcessor />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      )}
    </div>
  );
}
