// src/app/(dashboard)/dashboard/tools/routes/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Truck, MapPin, Clock, AlertCircle } from 'lucide-react';

export default function RouteOptimizationPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [optimizationComplete, setOptimizationComplete] = useState(false);

  const handleOptimize = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setOptimizationComplete(true);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Route Optimization</h1>
        <Button>
          <MapPin className="mr-2 h-4 w-4" /> View Map
        </Button>
      </div>

      <Tabs defaultValue="optimize" className="space-y-4">
        <TabsList>
          <TabsTrigger value="optimize">Optimize Routes</TabsTrigger>
          <TabsTrigger value="current">Current Routes</TabsTrigger>
          <TabsTrigger value="history">Route History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="optimize" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Optimization Parameters</CardTitle>
                <CardDescription>Configure route optimization settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicles">Number of Vehicles</Label>
                    <Input id="vehicles" type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="optimization-type">Optimization Type</Label>
                    <Select defaultValue="distance">
                      <SelectTrigger id="optimization-type">
                        <SelectValue placeholder="Select optimization type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="distance">Minimize Distance</SelectItem>
                        <SelectItem value="time">Minimize Time</SelectItem>
                        <SelectItem value="cost">Minimize Cost</SelectItem>
                        <SelectItem value="balanced">Balanced Load</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select defaultValue="standard">
                      <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="urgent">Urgent Deliveries First</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="custom">Custom Rules</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="constraints">Additional Constraints</Label>
                  <Select defaultValue="none">
                    <SelectTrigger id="constraints">
                      <SelectValue placeholder="Select constraint type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="time-windows">Time Windows</SelectItem>
                      <SelectItem value="vehicle-capacity">Vehicle Capacity</SelectItem>
                      <SelectItem value="driver-hours">Driver Hours</SelectItem>
                      <SelectItem value="custom">Custom Constraints</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Reset</Button>
                <Button onClick={handleOptimize} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Optimizing...
                    </>
                  ) : (
                    <>Optimize Routes</>
                  )}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery Locations</CardTitle>
                <CardDescription>
                  <span className="font-medium">42</span> locations loaded
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[280px] overflow-y-auto">
                <div className="space-y-2">
                  {['123 Main St, New York, NY', '456 Oak Ave, Boston, MA', '789 Pine Rd, Chicago, IL', '101 Maple Dr, Seattle, WA'].map((location, index) => (
                    <div key={index} className="flex items-start space-x-2 p-2 rounded-md bg-gray-100 dark:bg-gray-800">
                      <MapPin className="h-4 w-4 mt-0.5 text-primary" />
                      <span className="text-sm">{location}</span>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full text-sm">
                    View all 42 locations
                  </Button>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  <span>Upload Locations</span>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {optimizationComplete && (
            <Card>
              <CardHeader>
                <CardTitle>Optimization Results</CardTitle>
                <CardDescription>
                  Generated on May 5, 2025 at 10:34 AM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Optimization Complete</AlertTitle>
                    <AlertDescription>
                      Route optimization completed successfully. Total distance reduced by 18% compared to previous routes.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Truck className="h-5 w-5 text-primary" />
                        <span className="font-medium">5 Vehicles</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">All vehicles utilized</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-primary" />
                        <span className="font-medium">42 Stops</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">All deliveries assigned</p>
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-primary" />
                        <span className="font-medium">8.5 Hours</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">Est. completion time</p>
                    </div>
                  </div>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Vehicle</TableHead>
                        <TableHead>Driver</TableHead>
                        <TableHead>Stops</TableHead>
                        <TableHead>Distance</TableHead>
                        <TableHead>Est. Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Truck 01</TableCell>
                        <TableCell>John Smith</TableCell>
                        <TableCell>9</TableCell>
                        <TableCell>47.2 miles</TableCell>
                        <TableCell>3.5 hours</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Truck 02</TableCell>
                        <TableCell>Maria Garcia</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>42.8 miles</TableCell>
                        <TableCell>3.2 hours</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Truck 03</TableCell>
                        <TableCell>David Lee</TableCell>
                        <TableCell>10</TableCell>
                        <TableCell>55.6 miles</TableCell>
                        <TableCell>4.1 hours</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Truck 04</TableCell>
                        <TableCell>Sarah Johnson</TableCell>
                        <TableCell>7</TableCell>
                        <TableCell>38.9 miles</TableCell>
                        <TableCell>2.9 hours</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Truck 05</TableCell>
                        <TableCell>Michael Brown</TableCell>
                        <TableCell>8</TableCell>
                        <TableCell>44.3 miles</TableCell>
                        <TableCell>3.3 hours</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Export to CSV</Button>
                <Button>
                  <MapPin className="mr-2 h-4 w-4" /> View on Map
                </Button>
              </CardFooter>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="current">
          <Card>
            <CardHeader>
              <CardTitle>Current Routes</CardTitle>
              <CardDescription>View and manage active routes</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Current routes content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Route History</CardTitle>
              <CardDescription>View previous route optimizations</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Route history content will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}