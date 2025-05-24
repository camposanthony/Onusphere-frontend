import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Package, AlertCircle, TrendingUp, Truck, Users, Calendar, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
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
                    Logistics management overview and insights
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    May 5, 2025
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700 dark:text-blue-300">Active Shipments</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">142</div>
              <p className="text-sm text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">+12%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Inventory Items</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                <Package className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">2,580</div>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">+4%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700 dark:text-purple-300">Efficiency Rate</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-purple-100 dark:bg-purple-800 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">92.8%</div>
              <p className="text-sm text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                <span className="font-medium">+3.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-amber-700 dark:text-amber-300">Active Users</CardTitle>
              <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900 dark:text-amber-100">38</div>
              <p className="text-sm text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span className="font-medium">+7</span> new users this month
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
              value="shipments" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
            >
              Shipments
            </TabsTrigger>
            <TabsTrigger 
              value="inventory" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
            >
              Inventory
            </TabsTrigger>
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
            >
              Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {/* Performance Overview */}
            <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Performance Overview</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">Monthly metrics and KPIs for your logistics operations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Performance Insights</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Performance chart will be displayed here</p>
                  <Button className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80">
                    Generate Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity and Alerts */}
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
              {/* Recent Activity */}
              <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                      <Truck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">Recent Activity</CardTitle>
                      <CardDescription className="text-slate-600 dark:text-slate-400">Latest actions and updates</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-2 rounded-full">
                        <Truck className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">New shipment created</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">30 minutes ago by Michael Chen</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-2 rounded-full">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Inventory update completed</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">2 hours ago by System</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-full">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-white">New user added to team</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Yesterday by Sarah Johnson</p>
                      </div>
                    </div>
                  </div>
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
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                      <div className="bg-red-100 dark:bg-red-800 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-red-500 dark:text-red-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-red-900 dark:text-red-100">Low inventory alert</p>
                        <p className="text-xs text-red-600 dark:text-red-400">5 items below threshold</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <div className="bg-amber-100 dark:bg-amber-800 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-amber-900 dark:text-amber-100">Delayed shipment</p>
                        <p className="text-xs text-amber-600 dark:text-amber-400">ID #45628 is behind schedule</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                      <div className="bg-blue-100 dark:bg-blue-800 p-2 rounded-full">
                        <AlertCircle className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">System maintenance</p>
                        <p className="text-xs text-blue-600 dark:text-blue-400">Scheduled for tonight at 2:00 AM</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="shipments">
            <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Truck className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Active Shipments</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">Track and manage your current shipments</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Truck className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Shipments Management</h3>
                  <p className="text-slate-600 dark:text-slate-400">Shipments content will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inventory">
            <Card className="shadow-none border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">Inventory Management</CardTitle>
                    <CardDescription className="text-slate-600 dark:text-slate-400">View and manage your inventory items</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Inventory Overview</h3>
                  <p className="text-slate-600 dark:text-slate-400">Inventory content will be displayed here</p>
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
                    <CardDescription className="text-slate-600 dark:text-slate-400">Detailed performance metrics and insights</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="py-16">
                <div className="text-center">
                  <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-10 w-10 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Performance Analytics</h3>
                  <p className="text-slate-600 dark:text-slate-400">Analytics content will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}