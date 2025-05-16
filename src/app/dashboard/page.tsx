import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Package, AlertCircle, TrendingUp, Truck, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="inline mr-1 h-4 w-4" /> May 5, 2025
          </span>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">142</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,580</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+4%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Efficiency Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92.8%</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+3.2%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">+7</span> new users this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="shipments">Shipments</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Overview</CardTitle>
              <CardDescription>Monthly metrics and KPIs for your logistics operations</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 mx-auto text-gray-400" />
                <p className="mt-2 text-sm text-gray-500">Performance chart will be displayed here</p>
                <Button className="mt-4">Generate Report</Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity and Alerts */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Truck className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New shipment created</p>
                      <p className="text-xs text-gray-500">30 minutes ago by Michael Chen</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Package className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Inventory update completed</p>
                      <p className="text-xs text-gray-500">2 hours ago by System</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">New user added to team</p>
                      <p className="text-xs text-gray-500">Yesterday by Sarah Johnson</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Alerts</CardTitle>
                <CardDescription>Issues requiring attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-red-100 p-2 rounded-full">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Low inventory alert</p>
                      <p className="text-xs text-gray-500">5 items below threshold</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Delayed shipment</p>
                      <p className="text-xs text-gray-500">ID #45628 is behind schedule</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <AlertCircle className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">System maintenance</p>
                      <p className="text-xs text-gray-500">Scheduled for tonight at 2:00 AM</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>Track and manage your current shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Shipments content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>View and manage your inventory items</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Inventory content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed performance metrics and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}