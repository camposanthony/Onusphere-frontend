'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Package, AlertCircle, TrendingUp, Truck, Users, Calendar, Sparkles, DollarSign, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUsageData } from '@/lib/services/payment';
import { getCustomers } from '@/lib/services/load-plan-pro-api';

interface UsageData {
  current_month_trucks: number;
  total_trucks_loaded: number;
  current_month_cost: number;
  total_spent: number;
  price_per_truck: number;
  payment_method_connected: boolean;
  last_payment_date: number | null;
  next_billing_date: number | null;
}

interface Customer {
  id: string;
  name: string;
  email_domain: string;
  incompleteOrderCount?: number;
}

export default function DashboardPage() {
  const [usageData, setUsageData] = useState<UsageData>({
    current_month_trucks: 0,
    total_trucks_loaded: 0,
    current_month_cost: 0,
    total_spent: 0,
    price_per_truck: 25.00,
    payment_method_connected: false,
    last_payment_date: null,
    next_billing_date: null,
  });
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const [usage, customerList] = await Promise.all([
          getUsageData(),
          getCustomers(),
        ]);
        
        setUsageData(usage);
        setCustomers(customerList);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate efficiency rate based on payment method connection and usage
  const efficiencyRate = usageData.payment_method_connected 
    ? Math.min(95, 75 + (usageData.current_month_trucks * 2)) 
    : 0;

  // Calculate total incomplete orders across all customers
  const totalIncompleteOrders = customers.reduce((total, customer) => {
    return total + (customer.incompleteOrderCount || 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    Dashboard
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Load Plan Pro usage overview and insights
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    {new Date().toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="relative">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/20 border-t-primary"></div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">Loading dashboard data...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-8">
            <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Overview Cards */}
        {!isLoading && (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Trucks Loaded This Month</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                    <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{usageData.current_month_trucks}</div>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">${usageData.current_month_cost.toFixed(2)}</span> current bill
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Total Customers</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                    <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{customers.length}</div>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    <span className="font-medium">{totalIncompleteOrders}</span> pending orders
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">Total Trucks Loaded</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                    <Activity className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{usageData.total_trucks_loaded}</div>
                  <p className="text-sm text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    <span className="font-medium">${usageData.total_spent.toFixed(2)}</span> total spent
                  </p>
                </CardContent>
              </Card>

              <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 transition-all duration-200">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                  <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-300">Payment Status</CardTitle>
                  <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                    <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-900 dark:text-amber-100">
                    {usageData.payment_method_connected ? 'Connected' : 'Setup Required'}
                  </div>
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span className="font-medium">${usageData.price_per_truck.toFixed(2)}</span> per truck
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Tabs */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <TabsTrigger 
                  value="overview" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="usage" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
                >
                  Usage & Billing
                </TabsTrigger>
                <TabsTrigger 
                  value="customers" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
                >
                  Customers
                </TabsTrigger>
                <TabsTrigger 
                  value="analytics" 
                  className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
                >
                  Analytics
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                {/* Load Plan Pro Overview */}
                <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                        <Truck className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Load Plan Pro Overview</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">Your truck loading optimization tool usage and performance</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                            <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100">Monthly Usage</h3>
                        </div>
                        <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-1">
                          {usageData.current_month_trucks} trucks
                        </div>
                        <p className="text-sm text-blue-600 dark:text-blue-400">
                          ${usageData.current_month_cost.toFixed(2)} this month
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                            <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">Active Customers</h3>
                        </div>
                        <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">
                          {customers.length}
                        </div>
                        <p className="text-sm text-emerald-600 dark:text-emerald-400">
                          {totalIncompleteOrders} pending orders
                        </p>
                      </div>

                      <div className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <h3 className="font-semibold text-purple-900 dark:text-purple-100">Total Lifetime</h3>
                        </div>
                        <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-1">
                          {usageData.total_trucks_loaded} trucks
                        </div>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                          ${usageData.total_spent.toFixed(2)} total spent
                        </p>
                      </div>
                    </div>

                    {!usageData.payment_method_connected && (
                      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                          <div>
                            <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">Payment Method Required</h3>
                            <p className="text-amber-700 dark:text-amber-300 mb-4">
                              Connect a payment method to start using Load Plan Pro. You'll be charged ${usageData.price_per_truck.toFixed(2)} per truck loaded.
                            </p>
                            <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                              Connect Payment Method
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-400">Latest Load Plan Pro usage</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {usageData.current_month_trucks > 0 ? (
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-full">
                              <Truck className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {usageData.current_month_trucks} trucks loaded this month
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                ${usageData.current_month_cost.toFixed(2)} in charges
                              </p>
                            </div>
                          </div>
                          {usageData.payment_method_connected && (
                            <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-full">
                                <Package className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-slate-900 dark:text-white">Payment method connected</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                  Next billing: {usageData.next_billing_date ? new Date(usageData.next_billing_date * 1000).toLocaleDateString() : 'TBD'}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <div className="mx-auto w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                            <Truck className="h-8 w-8 text-slate-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No activity yet</h3>
                          <p className="text-slate-600 dark:text-slate-400">Start loading trucks to see your activity here</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Alerts */}
                  <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-red-100 dark:bg-red-800 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Alerts</CardTitle>
                          <CardDescription className="text-slate-600 dark:text-slate-400">Issues requiring attention</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {!usageData.payment_method_connected && (
                          <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                            <div className="bg-red-100 dark:bg-red-800 p-2 rounded-full">
                              <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-red-900 dark:text-red-100">Payment method required</p>
                              <p className="text-xs text-red-600 dark:text-red-400">Connect payment to use Load Plan Pro</p>
                            </div>
                          </div>
                        )}
                        {totalIncompleteOrders > 0 && (
                          <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                            <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full">
                              <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Incomplete orders</p>
                              <p className="text-xs text-amber-600 dark:text-amber-400">{totalIncompleteOrders} orders need dimensions</p>
                            </div>
                          </div>
                        )}
                        {usageData.payment_method_connected && totalIncompleteOrders === 0 && (
                          <div className="flex items-start space-x-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                            <div className="bg-green-100 dark:bg-green-800 p-2 rounded-full">
                              <Sparkles className="h-4 w-4 text-green-500 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-green-900 dark:text-green-100">All systems operational</p>
                              <p className="text-xs text-green-600 dark:text-green-400">Ready to optimize truck loading</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="usage">
                <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <DollarSign className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Usage & Billing</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">Track your Load Plan Pro usage and billing information</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                                {usageData.next_billing_date ? new Date(usageData.next_billing_date * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
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

                    <div className="text-center py-8">
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        For detailed billing management, visit your settings page.
                      </p>
                      <Button variant="outline" onClick={() => window.location.href = '/dashboard/settings?tab=billing'}>
                        Manage Billing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="customers">
                <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                        <Users className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Customer Overview</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">Manage your Load Plan Pro customers</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                        <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                          {customers.length}
                        </div>
                        <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                          Total Customers
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                        <div className="text-3xl font-bold text-amber-900 dark:text-amber-100 mb-2">
                          {totalIncompleteOrders}
                        </div>
                        <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                          Pending Orders
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100 mb-2">
                          {customers.filter(c => (c.incompleteOrderCount || 0) === 0).length}
                        </div>
                        <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                          Up to Date
                        </div>
                      </div>
                    </div>

                    <div className="text-center py-8">
                      <p className="text-slate-600 dark:text-slate-400 mb-4">
                        Manage your customers and their orders in the Load Plan Pro tool.
                      </p>
                      <Button onClick={() => window.location.href = '/dashboard/tools/load-plan-pro/customer'}>
                        View All Customers
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="analytics">
                <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                        <TrendingUp className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Analytics</CardTitle>
                        <CardDescription className="text-slate-600 dark:text-slate-400">Load Plan Pro performance metrics and insights</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">Usage Trends</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-700 dark:text-blue-300">This Month</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">{usageData.current_month_trucks} trucks</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Average per Month</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">
                              {usageData.total_trucks_loaded > 0 ? Math.round(usageData.total_trucks_loaded / Math.max(1, Math.ceil((Date.now() - (usageData.last_payment_date || Date.now())) / (30 * 24 * 60 * 60 * 1000)))) : 0} trucks
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-blue-700 dark:text-blue-300">Cost per Truck</span>
                            <span className="font-medium text-blue-900 dark:text-blue-100">${usageData.price_per_truck.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 rounded-xl border border-emerald-200 dark:border-emerald-800">
                        <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-4">Customer Insights</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-emerald-700 dark:text-emerald-300">Total Customers</span>
                            <span className="font-medium text-emerald-900 dark:text-emerald-100">{customers.length}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-emerald-700 dark:text-emerald-300">Customers with Pending Orders</span>
                            <span className="font-medium text-emerald-900 dark:text-emerald-100">
                              {customers.filter(c => (c.incompleteOrderCount || 0) > 0).length}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-emerald-700 dark:text-emerald-300">Avg Orders per Customer</span>
                            <span className="font-medium text-emerald-900 dark:text-emerald-100">
                              {customers.length > 0 ? (totalIncompleteOrders / customers.length).toFixed(1) : '0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {usageData.total_trucks_loaded === 0 && (
                      <div className="text-center py-8">
                        <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                          <TrendingUp className="h-10 w-10 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No Analytics Data Yet</h3>
                        <p className="text-slate-600 dark:text-slate-400">Start using Load Plan Pro to see detailed analytics and insights</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}