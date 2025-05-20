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

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
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
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Tabs
        defaultValue="account"
        className="space-y-4"
        onValueChange={handleTabChange}
      >
        <TabsList>
          <TabsTrigger value="account">
            <User className="h-4 w-4 mr-2" />
            Account
          </TabsTrigger>
          <TabsTrigger value="company">
            <Building className="h-4 w-4 mr-2" />
            Company
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <BellRing className="h-4 w-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing">
            <CreditCard className="h-4 w-4 mr-2" />
            Billing
          </TabsTrigger>
        </TabsList>

        {/* Account Settings */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account details and personal information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={(e) => handleSubmit(e, "account")}>
                {successMessage && (
                  <div className="p-4 mb-4 text-green-700 bg-green-50 border border-green-200 rounded-md">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="p-4 mb-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {errorMessage}
                  </div>
                )}

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={formData.email}
                      type="email"
                      disabled
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone number</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={saving}>
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
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={(e) => handleSubmit(e, "company")}>
                {successMessage && (
                  <div className="p-4 mb-4 text-green-700 bg-green-50 border border-green-200 rounded-md">
                    {successMessage}
                  </div>
                )}
                {errorMessage && (
                  <div className="p-4 mb-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
                    {errorMessage}
                  </div>
                )}

                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="company_name">Company Name</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_email">Company Email</Label>
                    <Input
                      id="company_email"
                      value={formData.company_email}
                      onChange={handleChange}
                      type="email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_code">Company Code</Label>
                    <Input
                      id="company_code"
                      value={formData.company_code}
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={saving}>
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
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what types of notifications you&apos;d like to receive.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {successMessage && (
                <div className="p-4 mb-4 text-green-700 bg-green-50 border border-green-200 rounded-md">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="p-4 mb-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Notifications</h3>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Order Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when orders are created, updated, or
                      delivered.
                    </p>
                  </div>
                  <Switch defaultChecked id="notify-orders" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Customer Activity</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications about customer activity and changes.
                    </p>
                  </div>
                  <Switch defaultChecked id="notify-customers" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Team Member Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifications when team members join or roles change.
                    </p>
                  </div>
                  <Switch defaultChecked id="notify-team" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Important system updates, maintenance announcements, and
                      new features.
                    </p>
                  </div>
                  <Switch defaultChecked id="notify-system" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Marketing and Newsletters</h4>
                    <p className="text-sm text-muted-foreground">
                      Promotional content, tips, and industry news.
                    </p>
                  </div>
                  <Switch id="notify-marketing" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">In-App Notifications</h3>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Real-time Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Show alerts for critical events in real-time within the
                      app.
                    </p>
                  </div>
                  <Switch defaultChecked id="notify-realtime" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Task Assignments</h4>
                    <p className="text-sm text-muted-foreground">
                      Notifications when tasks are assigned to you.
                    </p>
                  </div>
                  <Switch defaultChecked id="notify-tasks" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={(e) => handleSubmit(e, "notifications")}
                disabled={saving}
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
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Manage your password and security settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {successMessage && (
                <div className="p-4 mb-4 text-green-700 bg-green-50 border border-green-200 rounded-md">
                  {successMessage}
                </div>
              )}
              {errorMessage && (
                <div className="p-4 mb-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Change Password</h3>
                <Separator />

                <div className="grid gap-4 grid-cols-1">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New password</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm new password
                    </Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>

                <Button
                  size="sm"
                  className="mt-2"
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

              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  Two-Factor Authentication
                </h3>
                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Enable 2FA</h4>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                  <Switch id="enable-2fa" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Session Management</h3>
                <Separator />

                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">Current Session</h4>
                      <p className="text-sm text-muted-foreground">
                        MacBook Pro • Chicago, IL • May 7, 2025
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      This Device
                    </Button>
                  </div>

                  <div className="flex justify-between items-center p-4 border rounded-md">
                    <div>
                      <h4 className="font-medium">iPhone 16 Pro</h4>
                      <p className="text-sm text-muted-foreground">
                        Chicago, IL • Last active: 3 hours ago
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
                      Log Out
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full text-red-600 hover:text-red-700"
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
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
              <CardDescription>
                Manage your subscription and billing information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-md bg-muted/30">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">Professional Plan</h3>
                    <p className="text-sm text-muted-foreground">
                      $299/month • Renews on June 7, 2025
                    </p>
                  </div>
                  <Button variant="outline">Change Plan</Button>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h4 className="font-medium mb-2">Plan Features</h4>
                  <ul className="text-sm space-y-1">
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-green-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Up to 50 team members
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-green-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Unlimited shipments
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-green-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 text-green-500"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      24/7 priority support
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Method</h3>
                <Separator />

                <div className="flex justify-between items-center p-4 border rounded-md">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded">
                      <svg
                        className="h-6 w-6 text-blue-800"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect
                          x="1"
                          y="4"
                          width="22"
                          height="16"
                          rx="2"
                          ry="2"
                        />
                        <line x1="1" y1="10" x2="23" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-medium">Visa ending in 4242</h4>
                      <p className="text-sm text-muted-foreground">
                        Expires 12/2026
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>

                <Button variant="outline">
                  <svg
                    className="h-4 w-4 mr-2"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Add Payment Method
                </Button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing History</h3>
                <Separator />

                <div className="rounded-md border">
                  <div className="grid grid-cols-5 gap-4 p-4 bg-muted/50 font-medium text-sm">
                    <div className="col-span-2">Invoice</div>
                    <div>Amount</div>
                    <div>Date</div>
                    <div className="text-right">Status</div>
                  </div>
                  <div className="divide-y">
                    <div className="grid grid-cols-5 gap-4 p-4 items-center">
                      <div className="col-span-2">
                        <span>INV-2025-05-01</span>
                      </div>
                      <div>$299.00</div>
                      <div>May 1, 2025</div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Paid
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 p-4 items-center">
                      <div className="col-span-2">
                        <span>INV-2025-04-01</span>
                      </div>
                      <div>$299.00</div>
                      <div>Apr 1, 2025</div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Paid
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 p-4 items-center">
                      <div className="col-span-2">
                        <span>INV-2025-03-01</span>
                      </div>
                      <div>$299.00</div>
                      <div>Mar 1, 2025</div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                          Paid
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  View All Invoices
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
