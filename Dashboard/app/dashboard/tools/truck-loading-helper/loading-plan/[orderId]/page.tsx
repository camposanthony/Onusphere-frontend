'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Truck, 
  ArrowLeft, 
  Mail,
  Send,
  Image,
  Clock,
  AlertCircle,
  CheckCircle,
  Package,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

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

// Mock orders data that would be fetched from a database in a real application
const mockOrders: Order[] = [
  { 
    id: 'o1', 
    customer: 'Acme Corporation', 
    customerId: 'c1',
    products: ['Industrial Widgets (50)', 'Machine Parts (25)'], 
    status: 'pending', 
    date: '2025-05-02', 
    priority: 'high',
    loadingInstructions: {
      sequence: [
        '1. Load Machine Parts (25) at the front of the truck',
        '2. Secure with straps to prevent shifting',
        '3. Load Industrial Widgets (50) behind Machine Parts',
        '4. Ensure weight distribution is balanced across the truck bed'
      ],
      notes: 'Industrial Widgets are sensitive to vibration. Use additional padding between stacks.',
      vehicleType: 'Box truck (24ft)',
      estimatedTime: '60 minutes'
    }
  },
  { 
    id: 'o2', 
    customer: 'Acme Corporation', 
    customerId: 'c1',
    products: ['Assembly Kits (30)'], 
    status: 'loaded', 
    date: '2025-05-04', 
    priority: 'medium',
    loadingInstructions: {
      sequence: [
        '1. Stack Assembly Kits in groups of 5',
        '2. Load from back to front of the truck',
        '3. Use corner protectors on each stack',
        '4. Secure with ratchet straps after every 10 kits'
      ],
      notes: 'Assembly Kits contain small parts. Ensure packaging is intact before loading.',
      vehicleType: 'Cargo van',
      estimatedTime: '30 minutes'
    }
  },
  { 
    id: 'o3', 
    customer: 'Globex Inc.', 
    customerId: 'c2',
    products: ['Electronic Components (100)'], 
    status: 'delivered', 
    date: '2025-05-01', 
    priority: 'low',
    loadingInstructions: {
      sequence: [
        '1. Place anti-static mats on the truck floor',
        '2. Load Electronic Components in their original packaging',
        '3. Stack no more than 5 boxes high',
        '4. Use padding between layers for stability'
      ],
      notes: 'Electronic Components are sensitive to static electricity. Handle with anti-static gloves.',
      vehicleType: 'Box truck (16ft)',
      estimatedTime: '45 minutes'
    }
  }
];

export default function LoadingPlanPage() {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [emailSettings, setEmailSettings] = useState({
    enabled: false,
    address: '',
    automaticSend: false
  });
  const [viewingModel, setViewingModel] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: '' });
  
  useEffect(() => {
    const orderId = params.orderId as string;
    
    // Simulate API call to fetch order data
    setTimeout(() => {
      const foundOrder = mockOrders.find(o => o.id === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      }
      setIsLoading(false);
    }, 500);
  }, [params.orderId]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Truck className="h-8 w-8 animate-bounce text-blue-600" />
          <p className="text-lg font-medium">Loading truck plan...</p>
        </div>
      </div>
    );
  }
  
  if (!order) {
    return (
      <div className="container mx-auto py-6">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
          <h2 className="text-lg font-semibold mb-2">Order Not Found</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We couldn't find the loading plan for this order. It may have been deleted or doesn't exist.
          </p>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }
  
  if (!order.loadingInstructions) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-yellow-500 mb-3" />
          <h2 className="text-lg font-semibold mb-2">Loading Plan Not Available</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            This order doesn't have loading instructions yet. Please check back later.
          </p>
        </div>
      </div>
    );
  }
  
  // Email and model view handlers
  
  const handleEmailSend = () => {
    // In a real app, this would send an API request to send the email
    if (!emailSettings.address) {
      setEmailStatus({
        show: true,
        success: false,
        message: 'requires email'
      });
      
      // Auto-hide the error message after 3 seconds
      setTimeout(() => {
        setEmailStatus(prev => ({ ...prev, show: false }));
      }, 3000);
      return;
    }
    
    // Simulate API call
    setEmailStatus({
      show: true,
      success: true,
      message: `Sent`
    });
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => {
      setEmailStatus(prev => ({ ...prev, show: false }));
    }, 3000);
  };
  
  const handleToggleAutoEmail = (checked: boolean) => {
    setEmailSettings(prev => ({
      ...prev,
      automaticSend: checked
    }));
  };
  
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      
      <div className="grid gap-6">
        {/* Header Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <Truck className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl font-bold">Loading Instructions</h1>
                <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                  Order #{order.id}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {order.customer} • {order.date}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleEmailSend}>
                <Mail className="mr-2 h-4 w-4" />
                Email Instructions
              </Button>
              <Button size="sm">
                <Send className="mr-2 h-4 w-4" />
                Share with Loader
              </Button>
            </div>
          </div>
        </div>
        
        {/* Improved Main Content Layout */}
        <div className="grid gap-6">
          {/* Loading Instructions */}
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Truck className="mr-2 h-5 w-5 text-blue-600" />
                  Loading Instructions
                </CardTitle>
                <div className="flex items-center gap-2 mt-2">
                  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-blue-500" />
                    Vehicle: {order.loadingInstructions.vehicleType}
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-500" />
                    Est. time: {order.loadingInstructions.estimatedTime}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Products List */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-3 flex items-center">
                    <Package className="h-4 w-4 text-blue-600 mr-2" />
                    Products in this Order
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {order.products.map((product, index) => (
                      <Badge key={index} variant="outline" className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 px-3 py-1.5">
                        {product}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Step by Step Instructions - Made scrollable for longer content */}
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-3 flex items-center">
                    <Truck className="h-4 w-4 text-blue-600 mr-2" />
                    Step by Step Loading Instructions
                  </h3>
                  <div className="border rounded-md p-4 dark:border-gray-700 max-h-[300px] overflow-y-auto">
                    <div className="space-y-5">
                      {order.loadingInstructions.sequence.map((step, index) => (
                        <div key={index} className="flex items-start pb-5 border-b dark:border-gray-700 last:border-0 last:pb-0">
                          <div className="flex-shrink-0 h-7 w-7 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 mt-0.5">
                            <span className="text-sm font-semibold text-blue-800 dark:text-blue-300">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p>{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Special Notes */}
                {order.loadingInstructions.notes && (
                  <div className="mb-6">
                    <h3 className="text-base font-semibold mb-3 flex items-center">
                      <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                      Special Handling Notes
                    </h3>
                    <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
                      <p>{order.loadingInstructions.notes}</p>
                    </div>
                  </div>
                )}
                
                {/* Email Settings */}
                <div>
                  <h3 className="text-base font-semibold mb-3 flex items-center">
                    <Mail className="h-4 w-4 text-blue-600 mr-2" />
                    Email Notifications
                  </h3>
                  <div className="grid gap-4 rounded-lg border p-4 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="auto-email" className="flex flex-col">
                        <span className="font-medium">Automatic Email: Send instructions automatically when ready</span>
                      </Label>
                      <Switch 
                        id="auto-email" 
                        checked={emailSettings.automaticSend}
                        onCheckedChange={handleToggleAutoEmail}
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="email-address">Email Address</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="email-address" 
                          placeholder="driver@example.com" 
                          type="email" 
                          value={emailSettings.address}
                          onChange={(e) => setEmailSettings(prev => ({ ...prev, address: e.target.value }))}
                          className="flex-1"
                        />
                        <div className="relative">
                          <Button onClick={handleEmailSend}>
                            <Send className="mr-2 h-4 w-4" />
                            Send to Loader
                          </Button>
                          
                          {/* Email Status Notification */}
                          {emailStatus.show && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-md overflow-hidden shadow-md backdrop-blur-sm transition-all duration-200 ease-in-out">
                              <div className={`w-full h-full flex items-center justify-center gap-1.5 p-2 text-sm font-medium ${emailStatus.success ? 'bg-green-50/90 border border-green-200 text-green-700 dark:bg-green-900/80 dark:border-green-800 dark:text-green-300' : 'bg-red-50/90 border border-red-200 text-red-700 dark:bg-red-900/80 dark:border-red-800 dark:text-red-300'}`}>
                                {emailStatus.success ? (
                                  <CheckCircle className="h-4 w-4" />
                                ) : (
                                  <AlertCircle className="h-4 w-4" />
                                )}
                                {emailStatus.message}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Loading Model Visualization - Now with all 4 views */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5 text-blue-600" />
                    <span>Loading Model Visualization</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => setViewingModel(!viewingModel)}>
                    {viewingModel ? '2D Views' : '3D Interactive Model'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewingModel ? (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 aspect-video bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                    <div className="text-center p-8 w-full">
                      <Package className="mx-auto h-16 w-16 text-blue-500 mb-4" />
                      <h3 className="text-lg font-medium mb-2">3D Interactive Model</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                        This is where the interactive 3D model would be displayed, allowing users to 
                        rotate, zoom, and explore the truck loading configuration.
                      </p>
                      <div className="flex flex-wrap justify-center gap-3">
                        <Button variant="outline">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Rotate Left
                        </Button>
                        <Button>
                          <Package className="mr-2 h-4 w-4" />
                          Exploded View
                        </Button>
                        <Button variant="outline">
                          Rotate Right
                          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Front View */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Image className="h-4 w-4 text-blue-500 mr-2" />
                        Front View
                      </h3>
                      <div className="aspect-video bg-white dark:bg-gray-900 rounded flex items-center justify-center">
                        <div className="text-center p-4">
                          <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Front loading diagram
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Top View */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Image className="h-4 w-4 text-blue-500 mr-2" />
                        Top View
                      </h3>
                      <div className="aspect-video bg-white dark:bg-gray-900 rounded flex items-center justify-center">
                        <div className="text-center p-4">
                          <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Top loading diagram
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Back View */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Image className="h-4 w-4 text-blue-500 mr-2" />
                        Back View
                      </h3>
                      <div className="aspect-video bg-white dark:bg-gray-900 rounded flex items-center justify-center">
                        <div className="text-center p-4">
                          <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Back loading diagram
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Side View */}
                    <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 p-4">
                      <h3 className="text-sm font-medium mb-3 flex items-center">
                        <Image className="h-4 w-4 text-blue-500 mr-2" />
                        Side View
                      </h3>
                      <div className="aspect-video bg-white dark:bg-gray-900 rounded flex items-center justify-center">
                        <div className="text-center p-4">
                          <Image className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Side loading diagram
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
