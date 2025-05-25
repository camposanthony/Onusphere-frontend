"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Truck,
  ArrowLeft,
  Mail,
  Send,
  AlertCircle,
  CheckCircle,
  Package,
  Loader2,
  Share2,
  Layout,
  LayoutDashboard,
  ArrowUp,
  Grid,
  RotateCcw,
  FlipHorizontal,
  Sidebar,
  PanelRight,
  Image as ImageIcon,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  getCustomerOrders,
  BackendOrder,
  LoadingInstructionImage,
} from "@/lib/services/load-plan-pro-api";
import { toast } from "sonner";

export default function LoadingPlanPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<BackendOrder | null>(null);
  const [emailSettings, setEmailSettings] = useState({
    enabled: false,
    address: "",
    automaticSend: false,
  });
  const [viewingModel, setViewingModel] = useState(false);
  const [emailStatus, setEmailStatus] = useState<{
    show: boolean;
    success: boolean;
    message: string;
  }>({ show: false, success: false, message: "" });
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setIsLoading(true);
        // Get the customer ID from the search params
        const customerId = searchParams.get("customerId");

        if (!customerId) {
          throw new Error("Customer ID not found in URL");
        }

        // Get all orders and find the one we need
        const orders = await getCustomerOrders(customerId);
        const foundOrder = orders.find((o) => o.id === params.orderId);

        if (foundOrder) {
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary/20"></div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Loading order details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800 -ml-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </div>

          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-3 text-red-800 dark:text-red-200 text-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
              <div>
                <h2 className="text-lg font-semibold mb-2">Order Not Found</h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  We couldn&apos;t find the loading plan for this order. It may have
                  been deleted or doesn&apos;t exist.
                </p>
                <Button 
                  onClick={() => router.back()}
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const hasValidLoadingInstructions =
    order.loading_instructions &&
    (
      (Array.isArray(order.loading_instructions) && order.loading_instructions.length > 0) ||
      (typeof order.loading_instructions === "object" &&
       !Array.isArray(order.loading_instructions) &&
       (Array.isArray((order.loading_instructions as any).sequence) || 
        typeof (order.loading_instructions as any).notes === 'string'))
    );

  if (!hasValidLoadingInstructions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => router.back()}
              className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800 -ml-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Button>
          </div>

          <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
            <div className="flex items-center gap-3 text-amber-800 dark:text-amber-200 text-center justify-center">
              <AlertCircle className="h-12 w-12 text-amber-500 mb-3" />
              <div>
                <h2 className="text-lg font-semibold mb-2">
                  Loading Plan Not Available
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  This order doesn&apos;t have loading instructions yet. Please check
                  back later.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Email and model view handlers
  const handleEmailInstructions = async () => {
    if (!emailSettings.address) {
      toast.error("Please enter an email address");
      return;
    }

    try {
      setIsSendingEmail(true);
      // TODO: Replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call

      toast.success("Loading instructions sent successfully");
      setEmailStatus({
        show: true,
        success: true,
        message: "Instructions sent successfully",
      });
    } catch {
      toast.error("Failed to send instructions");
      setEmailStatus({
        show: true,
        success: false,
        message: "Failed to send instructions",
      });
    } finally {
      setIsSendingEmail(false);
      setTimeout(() => {
        setEmailStatus((prev) => ({ ...prev, show: false }));
      }, 3000);
    }
  };

  const handleToggleAutoEmail = (checked: boolean) => {
    setEmailSettings((prev) => ({
      ...prev,
      automaticSend: checked,
    }));
  };

  const handleShareWithLoader = async () => {
    try {
      setIsSharing(true);
      // Generate a shareable URL
      const url = `${window.location.origin}/dashboard/tools/load-plan-pro/loading-plan/${params.orderId}?customerId=${searchParams.get("customerId")}`;

      // Try to use the Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: `Loading Instructions for Order #${order?.id}`,
          text: "Check out these loading instructions",
          url: url,
        });
        toast.success("Shared successfully");
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        toast.error("Failed to share instructions");
      }
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <Button 
                variant="ghost" 
                onClick={() => router.back()}
                className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800 -ml-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Button>
              
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Truck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    Loading Instructions
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant="outline"
                      className="bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                    >
                      Order #{order.id.slice(0, 8)}...
                    </Badge>
                    <span className="text-slate-600 dark:text-slate-400 text-lg">
                      {new Date(order.order_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={handleEmailInstructions}
                disabled={isSendingEmail}
                className="h-11 px-6 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                {isSendingEmail ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 h-4 w-4" />
                )}
                {isSendingEmail ? "Sending..." : "Email Instructions"}
              </Button>
              <Button
                onClick={handleShareWithLoader}
                disabled={isSharing}
                className="h-11 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200"
              >
                {isSharing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Share2 className="mr-2 h-4 w-4" />
                )}
                {isSharing ? "Sharing..." : "Share with Loader"}
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid gap-6">
          {/* Loading Instructions */}
          <Card className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center text-lg text-slate-900 dark:text-white">
                <Truck className="mr-2 h-5 w-5 text-slate-600 dark:text-slate-400" />
                Loading Instructions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Loading Instructions Content */}
              <div className="mb-6">
                {order.loading_instructions &&
                  (() => {
                    // Check if loading instructions are images (array of objects with label and base64)
                    if (Array.isArray(order.loading_instructions) && 
                        order.loading_instructions.length > 0 && 
                        typeof order.loading_instructions[0] === 'object' && 
                        'label' in order.loading_instructions[0] && 
                        'base64' in order.loading_instructions[0]) {
                      
                      const images = order.loading_instructions as LoadingInstructionImage[];
                      
                      return (
                        <div className="space-y-6">
                          <h3 className="text-base font-semibold mb-3 flex items-center text-slate-900 dark:text-white">
                            <ImageIcon className="h-4 w-4 text-slate-600 dark:text-slate-400 mr-2" />
                            Visual Loading Instructions
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {images.map((image, index) => (
                              <div
                                key={index}
                                className="border rounded-xl p-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                              >
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="text-sm font-medium text-slate-900 dark:text-white capitalize">
                                    {image.label.replace('-', ' ')} View
                                  </h4>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      // Open image in new tab for full view
                                      const newWindow = window.open();
                                      if (newWindow) {
                                        newWindow.document.write(`
                                          <html>
                                            <head><title>${image.label} View</title></head>
                                            <body style="margin:0;background:#000;display:flex;align-items:center;justify-content:center;min-height:100vh;">
                                              <img src="data:image/png;base64,${image.base64}" style="max-width:100%;max-height:100%;object-fit:contain;" alt="${image.label} view" />
                                            </body>
                                          </html>
                                        `);
                                      }
                                    }}
                                    className="h-8 px-3 text-xs"
                                  >
                                    <ZoomIn className="h-3 w-3 mr-1" />
                                    Full Size
                                  </Button>
                                </div>
                                <div className="aspect-video bg-slate-100 dark:bg-slate-900 rounded-lg overflow-hidden">
                                  <img
                                    src={`data:image/png;base64,${image.base64}`}
                                    alt={`${image.label} loading view`}
                                    className="w-full h-full object-contain"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const parent = target.parentElement;
                                      if (parent) {
                                        parent.innerHTML = `
                                          <div class="flex items-center justify-center h-full text-slate-500">
                                            <div class="text-center">
                                              <svg class="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                              </svg>
                                              <p class="text-sm">Failed to load image</p>
                                            </div>
                                          </div>
                                        `;
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    
                    // Handle text instructions (array of strings or object with sequence)
                    const instructions = Array.isArray(order.loading_instructions)
                      ? order.loading_instructions as string[]
                      : (order.loading_instructions as any).sequence || [];
                    
                    if (instructions.length > 0) {
                      return (
                        <div>
                          <h3 className="text-base font-semibold mb-3 flex items-center text-slate-900 dark:text-white">
                            <Package className="h-4 w-4 text-slate-600 dark:text-slate-400 mr-2" />
                            Step by Step Instructions
                          </h3>
                          <div className="border rounded-xl p-4 border-slate-200 dark:border-slate-700 max-h-[300px] overflow-y-auto bg-slate-50 dark:bg-slate-900/50">
                            <div className="space-y-5">
                              {instructions.map((step: string, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start pb-5 border-b border-slate-200 dark:border-slate-700 last:border-0 last:pb-0"
                                >
                                  <div className="flex-shrink-0 h-7 w-7 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-sm font-semibold text-primary dark:text-primary">
                                      {index + 1}
                                    </span>
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-slate-700 dark:text-slate-300">{step}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    
                    return null;
                  })()}
              </div>

              {/* Special Notes */}
              {order.loading_instructions &&
                typeof order.loading_instructions === "object" &&
                !Array.isArray(order.loading_instructions) &&
                order.loading_instructions.notes && (
                  <div className="mb-6">
                    <h3 className="text-base font-semibold mb-3 flex items-center text-slate-900 dark:text-white">
                      <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
                      Special Handling Notes
                    </h3>
                    <div className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20 p-4">
                      <p className="text-slate-700 dark:text-slate-300">{order.loading_instructions.notes}</p>
                    </div>
                  </div>
                )}

              {/* Email Settings */}
              <div>
                <h3 className="text-base font-semibold mb-3 flex items-center text-slate-900 dark:text-white">
                  <Mail className="h-4 w-4 text-slate-600 dark:text-slate-400 mr-2" />
                  Email Notifications
                </h3>
                <div className="grid gap-4 rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-900/50">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-email" className="flex flex-col">
                      <span className="font-medium">
                        Automatic Email: Send instructions automatically when
                        ready
                      </span>
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
                        onChange={(e) =>
                          setEmailSettings((prev) => ({
                            ...prev,
                            address: e.target.value,
                          }))
                        }
                        className="flex-1"
                      />
                      <div className="relative">
                        <Button
                          onClick={handleEmailInstructions}
                          disabled={isSendingEmail}
                          className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
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
                            <div
                              className={`w-full h-full flex items-center justify-center gap-1.5 p-2 text-sm font-medium ${emailStatus.success ? "bg-green-50/90 border border-green-200 text-green-700 dark:bg-green-900/80 dark:border-green-800 dark:text-green-300" : "bg-red-50/90 border border-red-200 text-red-700 dark:bg-red-900/80 dark:border-red-800 dark:text-red-300"}`}
                            >
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
          <Card className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-900 dark:text-white">
                <div className="flex items-center">
                  <Package className="mr-2 h-5 w-5 text-slate-600 dark:text-slate-400" />
                  <span>Loading Model Visualization</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setViewingModel(!viewingModel)}
                  className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
                >
                  {viewingModel ? "2D Views" : "3D Interactive Model"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {viewingModel ? (
                <div className="rounded-xl border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <div className="text-center p-8 w-full">
                    <Package className="mx-auto h-16 w-16 text-slate-500 mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-white">
                      3D Interactive Model
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                      This is where the interactive 3D model would be displayed,
                      allowing users to rotate, zoom, and explore the truck
                      loading configuration.
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Rotate Left
                      </Button>
                      <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">
                        <Package className="mr-2 h-4 w-4" />
                        Exploded View
                      </Button>
                      <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                        Rotate Right
                        <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                (() => {
                  // Check if we have image-based loading instructions
                  const hasImages = Array.isArray(order.loading_instructions) && 
                    order.loading_instructions.length > 0 && 
                    typeof order.loading_instructions[0] === 'object' && 
                    'label' in order.loading_instructions[0] && 
                    'base64' in order.loading_instructions[0];

                  if (hasImages) {
                    // If we have images in loading instructions, show a different view here
                    return (
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                        <div className="text-center p-8 w-full">
                          <Package className="mx-auto h-16 w-16 text-slate-500 mb-4" />
                          <h3 className="text-lg font-medium mb-2 text-slate-900 dark:text-white">
                            Interactive Model View
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
                            The loading instructions above show the visual diagrams. This section could display 
                            an interactive 3D model or additional analysis tools.
                          </p>
                          <div className="flex flex-wrap justify-center gap-3">
                            <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                              <Package className="mr-2 h-4 w-4" />
                              3D Model
                            </Button>
                            <Button variant="outline" className="bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700">
                              <Grid className="mr-2 h-4 w-4" />
                              Analysis
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Fallback to placeholder views if no images
                  return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Front View */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-4">
                        <h3 className="text-sm font-medium mb-3 flex items-center text-slate-900 dark:text-white">
                          <Layout className="h-4 w-4 text-slate-500 mr-2" />
                          Front View
                        </h3>
                        <div className="aspect-video bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center">
                          <div className="text-center p-4">
                            <LayoutDashboard className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Front loading diagram
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Top View */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-4">
                        <h3 className="text-sm font-medium mb-3 flex items-center text-slate-900 dark:text-white">
                          <ArrowUp className="h-4 w-4 text-slate-500 mr-2" />
                          Top View
                        </h3>
                        <div className="aspect-video bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center">
                          <div className="text-center p-4">
                            <Grid className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Top loading diagram
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Back View */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-4">
                        <h3 className="text-sm font-medium mb-3 flex items-center text-slate-900 dark:text-white">
                          <RotateCcw className="h-4 w-4 text-slate-500 mr-2" />
                          Back View
                        </h3>
                        <div className="aspect-video bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center">
                          <div className="text-center p-4">
                            <FlipHorizontal className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Back loading diagram
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* Side View */}
                      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 p-4">
                        <h3 className="text-sm font-medium mb-3 flex items-center text-slate-900 dark:text-white">
                          <Sidebar className="h-4 w-4 text-slate-500 mr-2" />
                          Side View
                        </h3>
                        <div className="aspect-video bg-white dark:bg-slate-900 rounded-lg flex items-center justify-center">
                          <div className="text-center p-4">
                            <PanelRight className="mx-auto h-12 w-12 text-slate-400 mb-2" />
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              Side loading diagram
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
