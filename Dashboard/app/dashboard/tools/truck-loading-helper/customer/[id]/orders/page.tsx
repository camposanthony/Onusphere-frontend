'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { use } from 'react';
import { 
  Search,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Filter,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCustomerById, getCustomerOrders, createTestOrder, Customer, Order } from '@/lib/services/truck-loading-api';
import { toast } from 'sonner';

export default function CustomerOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchCustomerAndOrders();
  }, [params.id]);

  const fetchCustomerAndOrders = async () => {
    try {
      setIsLoading(true);
      const customerId = params.id as string;
      const [customerData, ordersData] = await Promise.all([
        getCustomerById(customerId),
        getCustomerOrders(customerId)
      ]);
      setCustomer(customerData);
      setOrders(ordersData);
    } catch (err) {
      console.error('Error fetching customer and orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load customer data');
      toast.error('Failed to load customer data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTestOrder = async () => {
    try {
      const newOrder = await createTestOrder();
      setOrders(prevOrders => [...prevOrders, newOrder]);
      toast.success('Test order created successfully');
    } catch (error) {
      console.error('Error creating test order:', error);
      toast.error('Failed to create test order');
    }
  };

  const handleOrderClick = (orderId: string) => {
    const customerId = params.id as string;
    router.push(`/dashboard/tools/truck-loading-helper/loading-plan/${orderId}?customerId=${customerId}`);
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
          </Button>
        </div>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-600 dark:text-gray-300">Loading customer data...</p>
          </div>
        ) : customer ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{customer.name}</CardTitle>
                <CardDescription>{customer.email_domain}</CardDescription>
              </CardHeader>
            </Card>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="loaded">Loaded</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center mb-6">
              <Button onClick={handleCreateTestOrder}>Create Test Order</Button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">No orders found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <Card 
                    key={order.id}
                    className="relative hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleOrderClick(order.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">Order #{order.id}</CardTitle>
                          <CardDescription>
                            {new Date(order.order_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <span className={`absolute top-4 right-4 px-2 py-1 rounded text-sm z-10 ${
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          order.status === 'loaded' ? 'bg-green-100 text-green-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {order.items.length} items
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">Customer not found</p>
          </div>
        )}
      </div>
    </div>
  );
} 