"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  BellRing,
  Building,
  CreditCard,
  Shield,
  User,
  Loader2,
  Settings,
  Truck,
  Plus,
  CheckCircle,
  DollarSign,
  Activity,
  Calendar,
  Link,
  Unlink,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  getUserSettings,
  getCompanySettings,
  updateUserSettings,
  updateCompanySettings,
  // UserSettings,
  // CompanySettings,
} from "@/lib/services/users";
import {
  getUsageData,
  getTruckCredits,
  getPaymentHistory,
  redirectToCheckout,
  redirectToBillingPortal,
  disconnectPaymentMethod,
} from "@/lib/services/payment";

export default function SettingsPage() {
  // Removed unused userSettings and companySettings state
  // const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  // const [companySettings, setCompanySettings] =
  //   useState<CompanySettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // Removed unused activeTab state
  // const [activeTab, setActiveTab] = useState("account");

  // Payment-related state
  const [usageData, setUsageData] = useState({
    current_month_trucks: 0,
    total_trucks_loaded: 0,
    current_month_cost: 0,
    total_spent: 0,
    price_per_truck: 25.00,
    payment_method_connected: false,
    last_payment_date: null as Date | null,
    next_billing_date: null as Date | null,
  });
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [connectingPayment, setConnectingPayment] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company_name: "",
    company_email: "",
    company_code: "",
  });

  // Load user and company data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userData, companyData] = await Promise.all([
          getUserSettings(),
          getCompanySettings(),
        ]);

        // setUserSettings(userData);
        // setCompanySettings(companyData);

        setFormData({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || "",
          company_name: companyData.name,
          company_email: companyData.email,
          company_code: companyData.company_code,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load settings",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Load payment and usage data
  useEffect(() => {
    const fetchPaymentData = async () => {
      try {
        const [usageDataResult, history] = await Promise.all([
          getUsageData(),
          getPaymentHistory(),
        ]);
        
        setUsageData({
          current_month_trucks: usageDataResult.current_month_trucks,
          total_trucks_loaded: usageDataResult.total_trucks_loaded,
          current_month_cost: usageDataResult.current_month_cost,
          total_spent: usageDataResult.total_spent,
          price_per_truck: usageDataResult.price_per_truck,
          payment_method_connected: usageDataResult.payment_method_connected,
          last_payment_date: usageDataResult.last_payment_date ? new Date(usageDataResult.last_payment_date * 1000) : null,
          next_billing_date: usageDataResult.next_billing_date ? new Date(usageDataResult.next_billing_date * 1000) : null,
        });
        
        setPaymentHistory(history.payments);
      } catch (err) {
        console.error("Error loading payment data:", err);
      }
    };

    if (!loading) {
      fetchPaymentData();
    }
  }, [loading]);

  // Check for success/canceled payment on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success')) {
      setSuccessMessage('Payment method connected successfully! You will be charged monthly based on your usage.');
      // Refresh payment data
      getUsageData().then(usageResult => {
        setUsageData({
          current_month_trucks: usageResult.current_month_trucks,
          total_trucks_loaded: usageResult.total_trucks_loaded,
          current_month_cost: usageResult.current_month_cost,
          total_spent: usageResult.total_spent,
          price_per_truck: usageResult.price_per_truck,
          payment_method_connected: usageResult.payment_method_connected,
          last_payment_date: usageResult.last_payment_date ? new Date(usageResult.last_payment_date * 1000) : null,
          next_billing_date: usageResult.next_billing_date ? new Date(usageResult.next_billing_date * 1000) : null,
        });
      });
      getPaymentHistory().then(data => setPaymentHistory(data.payments));
    } else if (urlParams.get('canceled')) {
      setErrorMessage('Payment method connection was canceled.');
    }
  }, []);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle connecting payment method
  const handleConnectPayment = async () => {
    setConnectingPayment(true);
    try {
      // For initial setup, we can redirect to Stripe to set up payment method
      // You might want to create a different endpoint for setting up recurring billing
      await redirectToCheckout(1); // Minimal charge to set up payment method
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to connect payment method'
      );
      setConnectingPayment(false);
    }
  };

  // Handle disconnecting payment method
  const handleDisconnectPayment = async () => {
    try {
      const result = await disconnectPaymentMethod();
      if (result.status === 'success') {
        setUsageData(prev => ({ ...prev, payment_method_connected: false }));
        setSuccessMessage('Payment method disconnected successfully.');
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to disconnect payment method'
      );
    }
  };

  // Handle billing portal access
  const handleBillingPortal = async () => {
    try {
      await redirectToBillingPortal();
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : 'Failed to access billing portal'
      );
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, formType: string) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      if (formType === "account") {
        await updateUserSettings({
          name: formData.name,
          phone: formData.phone,
        });
        // setUserSettings(updated); // No longer needed
      } else if (formType === "company") {
        await updateCompanySettings({
          name: formData.company_name,
          email: formData.company_email,
        });
        // setCompanySettings(updated); // No longer needed
      }

      setSuccessMessage(
        `${formType.charAt(0).toUpperCase() + formType.slice(1)} settings updated successfully`,
      );
    } catch (err) {
      console.error(`Error updating ${formType} settings:`, err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : `Failed to update ${formType} settings`,
      );
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = () => {
    // setActiveTab(value); // No longer needed
    setSuccessMessage("");
    setErrorMessage("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="text-slate-600 dark:text-slate-400">Loading settings...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="p-6 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Enhanced Header Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Settings className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                  Settings
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  Manage your account settings and preferences
                </p>
              </div>
            </div>
          </div>

          <Tabs
            defaultValue="account"
            className="space-y-6"
            onValueChange={handleTabChange}
          >
            <TabsList className="bg-white dark:bg-slate-800 border-0 p-1 h-auto">
              <TabsTrigger value="account" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white transition-all duration-200 h-10 px-4">
                <User className="h-4 w-4 mr-2" />
                Account
              </TabsTrigger>
              <TabsTrigger value="company" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white transition-all duration-200 h-10 px-4">
                <Building className="h-4 w-4 mr-2" />
                Company
              </TabsTrigger>
              <TabsTrigger value="notifications" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white transition-all duration-200 h-10 px-4">
                <BellRing className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white transition-all duration-200 h-10 px-4">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="billing" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/90 data-[state=active]:text-white transition-all duration-200 h-10 px-4">
                <CreditCard className="h-4 w-4 mr-2" />
                Billing
              </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account" className="space-y-4">
              <Card className="shadow-none border border-slate-200 dark:border-slate-700 transition-all duration-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Profile Information</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Update your account details and personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <form onSubmit={(e) => handleSubmit(e, "account")}>
                    {successMessage && (
                      <div className="p-4 mb-4 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl">
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="p-4 mb-4 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 font-medium">Full Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300 font-medium">Email</Label>
                        <Input
                          id="email"
                          value={formData.email}
                          type="email"
                          disabled
                          className="bg-slate-100 dark:bg-slate-600 border-slate-300 dark:border-slate-500 h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300 font-medium">Phone number</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary h-11"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={saving} className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-11 px-6 transition-all duration-200">
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Company Settings */}
            <TabsContent value="company" className="space-y-4">
              <Card className="shadow-none border border-slate-200 dark:border-slate-700 transition-all duration-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Company Information</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Update your company details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  <form onSubmit={(e) => handleSubmit(e, "company")}>
                    {successMessage && (
                      <div className="p-4 mb-4 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl">
                        {successMessage}
                      </div>
                    )}
                    {errorMessage && (
                      <div className="p-4 mb-4 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl">
                        {errorMessage}
                      </div>
                    )}

                    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="company_name" className="text-slate-700 dark:text-slate-300 font-medium">Company Name</Label>
                        <Input
                          id="company_name"
                          value={formData.company_name}
                          onChange={handleChange}
                          className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company_email" className="text-slate-700 dark:text-slate-300 font-medium">Company Email</Label>
                        <Input
                          id="company_email"
                          value={formData.company_email}
                          onChange={handleChange}
                          type="email"
                          className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary h-11"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company_code" className="text-slate-700 dark:text-slate-300 font-medium">Company Code</Label>
                        <Input
                          id="company_code"
                          value={formData.company_code}
                          disabled
                          className="bg-slate-100 dark:bg-slate-600 border-slate-300 dark:border-slate-500 h-11"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={saving} className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-11 px-6 transition-all duration-200">
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Changes"
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="space-y-4">
              <Card className="shadow-none border border-slate-200 dark:border-slate-700 transition-all duration-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Notification Preferences</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Choose what types of notifications you&apos;d like to receive
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {successMessage && (
                    <div className="p-4 mb-4 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl">
                      {successMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="p-4 mb-4 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl">
                      {errorMessage}
                    </div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Email Notifications</h3>
                      <Separator className="mb-4" />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="space-y-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">Order Updates</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Receive notifications when orders are created, updated, or delivered
                            </p>
                          </div>
                          <Switch defaultChecked id="notify-orders" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="space-y-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">Customer Activity</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Receive notifications about customer activity and changes
                            </p>
                          </div>
                          <Switch defaultChecked id="notify-customers" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="space-y-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">Team Member Updates</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Notifications when team members join or roles change
                            </p>
                          </div>
                          <Switch defaultChecked id="notify-team" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="space-y-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">System Updates</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Important system updates, maintenance announcements, and new features
                            </p>
                          </div>
                          <Switch defaultChecked id="notify-system" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="space-y-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">Marketing and Newsletters</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Promotional content, tips, and industry news
                            </p>
                          </div>
                          <Switch id="notify-marketing" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">In-App Notifications</h3>
                      <Separator className="mb-4" />

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="space-y-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">Real-time Alerts</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Show alerts for critical events in real-time within the app
                            </p>
                          </div>
                          <Switch defaultChecked id="notify-realtime" />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                          <div className="space-y-1">
                            <h4 className="font-medium text-slate-900 dark:text-white">Task Assignments</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Notifications when tasks are assigned to you
                            </p>
                          </div>
                          <Switch defaultChecked id="notify-tasks" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-6">
                    <Button
                      onClick={(e) => handleSubmit(e, "notifications")}
                      disabled={saving}
                      className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-11 px-6 transition-all duration-200"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Preferences"
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-4">
              <Card className="shadow-none border border-slate-200 dark:border-slate-700 transition-all duration-200">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Account Security</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage your password and security settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {successMessage && (
                    <div className="p-4 mb-4 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl">
                      {successMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="p-4 mb-4 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl">
                      {errorMessage}
                    </div>
                  )}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Change Password</h3>
                      <Separator className="mb-4" />

                      <div className="grid gap-4 grid-cols-1">
                        <div className="space-y-2">
                          <Label htmlFor="current-password" className="text-slate-700 dark:text-slate-300 font-medium">Current password</Label>
                          <Input id="current-password" type="password" className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password" className="text-slate-700 dark:text-slate-300 font-medium">New password</Label>
                          <Input id="new-password" type="password" className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary h-11" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password" className="text-slate-700 dark:text-slate-300 font-medium">
                            Confirm new password
                          </Label>
                          <Input id="confirm-password" type="password" className="bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 focus:border-primary h-11" />
                        </div>
                      </div>

                      <Button
                        size="sm"
                        className="mt-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-10 px-4 transition-all duration-200"
                        onClick={(e) => handleSubmit(e, "password")}
                        disabled={saving}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          "Update Password"
                        )}
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                        Two-Factor Authentication
                      </h3>
                      <Separator className="mb-4" />

                      <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <div className="space-y-1">
                          <h4 className="font-medium text-slate-900 dark:text-white">Enable 2FA</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Switch id="enable-2fa" />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Session Management</h3>
                      <Separator className="mb-4" />

                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">Current Session</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              MacBook Pro • Chicago, IL • May 7, 2025
                            </p>
                          </div>
                          <Button variant="outline" size="sm" className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-900/20">
                            This Device
                          </Button>
                        </div>

                        <div className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div>
                            <h4 className="font-medium text-slate-900 dark:text-white">iPhone 16 Pro</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              Chicago, IL • Last active: 3 hours ago
                            </p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                          >
                            Log Out
                          </Button>
                        </div>

                        <Button
                          variant="outline"
                          className="w-full text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20 h-11 transition-all duration-200"
                          onClick={(e) => handleSubmit(e, "logout-all")}
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                            </>
                          ) : (
                            "Log Out of All Devices"
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Load Plan Pro Monthly Billing Section */}
            <TabsContent value="billing" className="space-y-6">
              {/* Usage Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="shadow-none border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">This Month</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{usageData.current_month_trucks}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">trucks loaded</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Truck className="h-6 w-6 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Current Bill</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">${usageData.current_month_cost.toFixed(2)}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">for this month</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Total Loaded</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white">{usageData.total_trucks_loaded}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">all time</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Activity className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-none border border-slate-200 dark:border-slate-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Next Billing</p>
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {usageData.next_billing_date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) || 'N/A'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-500">auto-charge</p>
                      </div>
                      <div className="h-12 w-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                        <Calendar className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Payment Method Section */}
              <Card className="shadow-none border border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-xl text-slate-900 dark:text-white flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Payment Method
                  </CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Connect a payment method to enable monthly billing for Load Plan Pro
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 p-6">
                  {successMessage && (
                    <div className="p-4 mb-4 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      {successMessage}
                    </div>
                  )}
                  {errorMessage && (
                    <div className="p-4 mb-4 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-xl">
                      {errorMessage}
                    </div>
                  )}

                  {usageData.payment_method_connected ? (
                    <div className="p-6 border border-green-200 dark:border-green-700 rounded-xl bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-slate-700">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                            <Link className="h-5 w-5 text-green-600 dark:text-green-400" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Payment Method Connected</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              You'll be charged monthly based on your Load Plan Pro usage
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline" 
                          onClick={handleDisconnectPayment}
                          className="text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-900/20"
                        >
                          <Unlink className="h-4 w-4 mr-2" />
                          Disconnect
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-green-200 dark:border-green-700">
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">${usageData.price_per_truck.toFixed(2)}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Per Truck</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {usageData.last_payment_date?.toLocaleDateString() || 'Never'}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Last Charged</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-semibold text-slate-900 dark:text-white">
                            {usageData.next_billing_date?.toLocaleDateString() || 'TBD'}
                          </div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">Next Billing</div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                      <div className="text-center mb-6">
                        <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
                          <CreditCard className="h-8 w-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Connect Payment Method</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
                          Connect a payment method to start using Load Plan Pro. You'll only be charged for the trucks you actually load.
                        </p>
                        
                        <div className="bg-white dark:bg-slate-700 rounded-lg p-4 mb-6 border border-slate-200 dark:border-slate-600">
                          <div className="flex items-center justify-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                              <span className="text-slate-600 dark:text-slate-400">$25 per truck loaded</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                              <span className="text-slate-600 dark:text-slate-400">Billed monthly</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                              <span className="text-slate-600 dark:text-slate-400">No setup fees</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Button
                        onClick={handleConnectPayment}
                        disabled={connectingPayment}
                        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-12 text-base transition-all duration-200"
                      >
                        {connectingPayment ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Connecting payment method...
                          </>
                        ) : (
                          <>
                            <Link className="mr-2 h-5 w-5" />
                            Connect Payment Method
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Billing History */}
              <Card className="shadow-none border border-slate-200 dark:border-slate-700">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:to-slate-700">
                  <CardTitle className="text-xl text-slate-900 dark:text-white">Billing History</CardTitle>
                  <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                    Your monthly Load Plan Pro charges
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  {paymentHistory.length > 0 ? (
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                      <div className="grid grid-cols-5 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 font-medium text-sm text-slate-700 dark:text-slate-300">
                        <div className="col-span-2">Period</div>
                        <div>Trucks Loaded</div>
                        <div>Amount</div>
                        <div className="text-right">Status</div>
                      </div>
                      <div className="divide-y divide-slate-200 dark:divide-slate-700">
                        {paymentHistory.slice(0, 5).map((payment) => (
                          <div key={payment.id} className="grid grid-cols-5 gap-4 p-4 items-center hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors duration-200">
                            <div className="col-span-2">
                              <span className="font-medium text-slate-900 dark:text-white">
                                {new Date(payment.created * 1000).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                              </span>
                            </div>
                            <div className="text-slate-700 dark:text-slate-300">{payment.trucks_purchased || payment.amount / 25} trucks</div>
                            <div className="text-slate-700 dark:text-slate-300">${payment.amount.toFixed(2)}</div>
                            <div className="text-right">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                payment.status === 'succeeded' 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                              }`}>
                                {payment.status === 'succeeded' ? 'Paid' : payment.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-600 dark:text-slate-400">
                      <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>No billing history yet</p>
                      <p className="text-sm">Connect a payment method and start loading trucks to see your monthly charges</p>
                    </div>
                  )}

                  {/* Billing Portal Access */}
                  {usageData.payment_method_connected && (
                    <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-600">
                      <Button
                        variant="outline"
                        onClick={handleBillingPortal}
                        className="w-full border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 h-11 transition-all duration-200"
                      >
                        <CreditCard className="h-4 w-4 mr-2" />
                        Manage Billing Information
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
