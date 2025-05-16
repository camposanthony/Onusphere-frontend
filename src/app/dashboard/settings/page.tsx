'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  BellRing,
  Building,
  CreditCard,
  Lock,
  Mail,
  Settings,
  Shield,
  User,
  Loader2,
} from 'lucide-react';
import { useUser } from '@/lib/hooks/useUser';
import { useState, useEffect } from 'react';
import { authPut } from '@/lib/utils/api';

// Extend the User interface to include additional fields
interface ExtendedUser {
  id: string;
  name: string;
  email: string;
  company_name?: string;
  company_type?: string;
  phone?: string;
  job_title?: string;
  timezone?: string;
}

export default function SettingsPage() {
  const { user, loading, error } = useUser() as { user: ExtendedUser | null, loading: boolean, error: string | null };
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [activeTab, setActiveTab] = useState('account');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company_name: '',
    company_type: '',
    phone: '',
    job_title: '',
    timezone: 'America/New_York',
    // Company address fields
    company_address: '',
    company_city: '',
    company_state: '',
    company_zip: '',
    company_country: 'US'
  });
  
  // Update form data when user data is loaded
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        company_name: user.company_name || '',
        company_type: user.company_type || '',
        phone: user.phone || '',
        job_title: user.job_title || '',
        timezone: user.timezone || 'America/New_York'
      }));
    }
  }, [user]);
  
  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent, formType: string) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');
    
    try {
      // Create payload based on form type
      const payload = formType === 'account' 
        ? {
            name: formData.name,
            phone: formData.phone,
            job_title: formData.job_title,
            timezone: formData.timezone
          }
        : formType === 'company'
        ? {
            company_name: formData.company_name,
            company_type: formData.company_type,
            company_address: formData.company_address,
            company_city: formData.company_city,
            company_state: formData.company_state,
            company_zip: formData.company_zip,
            company_country: formData.company_country
          }
        : formData;
      
      // Call the backend API to update user profile
      await authPut(`/me/update/${formType}`, payload);
      setSuccessMessage(`${formType.charAt(0).toUpperCase() + formType.slice(1)} settings updated successfully`);
    } catch (error) {
      console.error(`Error updating ${formType} settings:`, error);
      setErrorMessage(error instanceof Error ? error.message : `Failed to update ${formType} settings`);
    } finally {
      setSaving(false);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Reset messages when switching tabs
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      
      <Tabs defaultValue="account" className="space-y-4" onValueChange={handleTabChange}>
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
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading user data...</span>
                </div>
              ) : error ? (
                <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, 'account')}>
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
                        onChange={handleChange} 
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
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="job_title">Job title</Label>
                      <Input 
                        id="job_title" 
                        value={formData.job_title} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <select
                        id="timezone"
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.timezone}
                        onChange={handleChange}
                      >
                        <option value="America/New_York">Eastern Time (US & Canada)</option>
                        <option value="America/Chicago">Central Time (US & Canada)</option>
                        <option value="America/Denver">Mountain Time (US & Canada)</option>
                        <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                        <option value="UTC">UTC</option>
                      </select>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                type="submit"
                onClick={(e) => handleSubmit(e, 'account')}
                disabled={loading || saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Company Settings */}
        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Loading company data...</span>
                </div>
              ) : error ? (
                <div className="p-4 text-red-500 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              ) : (
                <form onSubmit={(e) => handleSubmit(e, 'company')}>
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
                      <Label htmlFor="company_name">Company name</Label>
                      <Input 
                        id="company_name" 
                        value={formData.company_name || ''} 
                        onChange={handleChange} 
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="company_type">Company type</Label>
                      <select
                        id="company_type"
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.company_type || ''}
                        onChange={handleChange}
                      >
                        <option value="">Select a company type</option>
                        <option value="carrier">Carrier</option>
                        <option value="3pl">3PL Provider</option>
                        <option value="shipper">Shipper</option>
                        <option value="warehouse">Warehouse Operator</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_email">Business email</Label>
                      <Input 
                        id="business_email" 
                        defaultValue={user?.email || ''} 
                        type="email" 
                        disabled 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="business_phone">Business phone</Label>
                      <Input 
                        id="business_phone" 
                        value={formData.phone || ''} 
                        onChange={handleChange} 
                      />
                    </div>
                    
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="company_address">Address</Label>
                      <Input 
                        id="company_address" 
                        value={formData.company_address || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_city">City</Label>
                      <Input 
                        id="company_city" 
                        value={formData.company_city || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_state">State/Province</Label>
                      <Input 
                        id="company_state" 
                        value={formData.company_state || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_zip">ZIP/Postal Code</Label>
                      <Input 
                        id="company_zip" 
                        value={formData.company_zip || ''}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company_country">Country</Label>
                      <select
                        id="company_country"
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"                        value={formData.company_country || 'US'}
                        onChange={handleChange}
                      >
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                </form>
              )}
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button 
                onClick={(e) => handleSubmit(e, 'company')}
                disabled={loading || saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what types of notifications you'd like to receive.
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
                      Receive notifications when orders are created, updated, or delivered.
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
                      Important system updates, maintenance announcements, and new features.
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
                      Show alerts for critical events in real-time within the app.
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
                onClick={(e) => handleSubmit(e, 'notifications')}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Preferences'}
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
                    <Label htmlFor="confirm-password">Confirm new password</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <Button 
                  size="sm" 
                  className="mt-2"
                  onClick={(e) => handleSubmit(e, 'password')}
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : 'Update Password'}
                </Button>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
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
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      Log Out
                    </Button>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700"
                    onClick={(e) => handleSubmit(e, 'logout-all')}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : 'Log Out of All Devices'}
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
                      <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Up to 50 team members
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Unlimited shipments
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                      Advanced analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                      <svg className="h-6 w-6 text-blue-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
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
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Paid</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 p-4 items-center">
                      <div className="col-span-2">
                        <span>INV-2025-04-01</span>
                      </div>
                      <div>$299.00</div>
                      <div>Apr 1, 2025</div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Paid</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-5 gap-4 p-4 items-center">
                      <div className="col-span-2">
                        <span>INV-2025-03-01</span>
                      </div>
                      <div>$299.00</div>
                      <div>Mar 1, 2025</div>
                      <div className="text-right">
                        <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Paid</span>
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