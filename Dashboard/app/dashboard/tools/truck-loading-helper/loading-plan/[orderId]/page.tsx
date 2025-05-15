'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
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
  Calendar,
  Loader2,
  Share2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getCustomerOrders } from '@/lib/services/truck-loading-api';
import { toast } from 'sonner';

interface Order {
  id: string;
  items: Array<{
    item_id: string;
    number_pallets: number;
  }>;
  order_date: string;
  upcoming_shipment_times: string[];
  status: 'pending' | 'loaded' | 'delivered';
  loading_instructions?: {
    sequence: string[];
    notes: string;
  };
}

export default function LoadingPlanPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        // Get the customer ID from the search params
        const customerId = searchParams.get('customerId');
        
        if (!customerId) {
          throw new Error('Customer ID not found in URL');
        }
        
        // Get all orders and find the one we need
        const orders = await getCustomerOrders(customerId);
        const foundOrder = orders.find(o => o.id === params.orderId);
        
        if (foundOrder) {
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
        toast.error('Failed to load order data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId, searchParams]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading order details...</p>
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
  
  if (!order.loading_instructions) {
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
  const handleEmailInstructions = async () => {
    if (!emailSettings.address) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      setIsSendingEmail(true);
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      toast.success('Loading instructions sent successfully');
      setEmailStatus({
        show: true,
        success: true,
        message: 'Instructions sent successfully'
      });
    } catch (error) {
      toast.error('Failed to send instructions');
      setEmailStatus({
        show: true,
        success: false,
        message: 'Failed to send instructions'
      });
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => {
        setEmailStatus(prev => ({ ...prev, show: false }));
      }, 3000);
    }
  };
  
  const handleToggleAutoEmail = (checked: boolean) => {
    setEmailSettings(prev => ({
      ...prev,
      automaticSend: checked
    }));
  };

  const handleShareWithLoader = async () => {
    try {
      setIsSharing(true);
      // Generate a shareable URL
      const url = `${window.location.origin}/dashboard/tools/truck-loading-helper/loading-plan/${params.orderId}?customerId=${searchParams.get('customerId')}`;
      setShareUrl(url);

      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Loading Instructions for Order #${order?.id}`,
          text: 'Check out these loading instructions',
          url: url
        });
        toast.success('Shared successfully');
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(url);
        toast.success('Link copied to clipboard');
      }
    } catch (error) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast.error('Failed to share instructions');
      }
    } finally {
      setIsSharing(false);
    }
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
                <Truck className="h-8 w-8 text-gray-600 dark:text-gray-400" />
                <h1 className="text-2xl font-bold">Loading Instructions</h1>
                <Badge variant="outline" className="ml-2 bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300 border-gray-200 dark:border-gray-800">
                  Order #{order.id}
                </Badge>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Order Date: {new Date(order.order_date).toLocaleDateString()}
              </p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleEmailInstructions}
                disabled={isSendingEmail}
              >
                {isSendingEmail ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {isSendingEmail ? 'Sending...' : 'Email Instructions'}
              </Button>
              <Button 
                size="sm"
                onClick={handleShareWithLoader}
                disabled={isSharing}
              >
                {isSharing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="mr-2 h-4 w-4" />
                )}
                {isSharing ? 'Sharing...' : 'Share with Loader'}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="grid gap-6">
          {/* Loading Instructions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Truck className="mr-2 h-5 w-5 text-gray-600" />
                Loading Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              
              {/* Step by Step Instructions */}
              <div className="mb-6">
                <div className="border rounded-md p-4 dark:border-gray-700 max-h-[300px] overflow-y-auto">
                  <div className="space-y-5">
                    {order.loading_instructions.sequence.map((step, index) => (
                      <div key={index} className="flex items-start pb-5 border-b dark:border-gray-700 last:border-0 last:pb-0">
                        <div className="flex-shrink-0 h-7 w-7 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-sm font-semibold text-gray-800 dark:text-gray-300">{index + 1}</span>
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
              {order.loading_instructions.notes && (
                <div className="mb-6">
                  <h3 className="text-base font-semibold mb-3 flex items-center">
                    <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                    Special Handling Notes
                  </h3>
                  <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
                    <p>{order.loading_instructions.notes}</p>
                  </div>
                </div>
              )}
              
              {/* Email Settings */}
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center">
                  <Mail className="h-4 w-4 text-gray-600 mr-2" />
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
                        <Button 
                          onClick={handleEmailInstructions}
                          disabled={isSendingEmail}
                        >
                          {isSendingEmail ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="mr-2 h-4 w-4" />
                          )}
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

          {/* Loading Model Visualization */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-gray-600" />
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
                    <Package className="mx-auto h-16 w-16 text-gray-500 mb-4" />
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
                      <Image className="h-4 w-4 text-gray-500 mr-2" />
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
                      <Image className="h-4 w-4 text-gray-500 mr-2" />
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
                      <Image className="h-4 w-4 text-gray-500 mr-2" />
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
                      <Image className="h-4 w-4 text-gray-500 mr-2" />
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
  );
}
