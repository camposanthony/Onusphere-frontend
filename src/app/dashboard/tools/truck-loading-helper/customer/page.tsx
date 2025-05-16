'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search,
  Mail,
  Loader2,
  AlertCircle,
  Send,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getCustomers, createCustomer, Customer } from '@/lib/services/truck-loading-api';

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showEmailInstructions, setShowEmailInstructions] = useState(false);
  const [processingEmail, setProcessingEmail] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  const processingSteps = [
    'Retrieving email content...',
    'Identifying customer information...',
    'Extracting order details...',
    'Analyzing product specifications...',
    'Calculating optimal loading sequence...',
    'Generating truck loading instructions...',
    'Optimizing for safety and efficiency...',
    'Finalizing loading plan...',
  ];

  // Fetch customers on component mount
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      const fetchedCustomers = await getCustomers();
      setCustomers(fetchedCustomers);
    } catch (err) {
      console.error('Error fetching customers:', err);
      setError(err instanceof Error ? err.message : 'Failed to load customers');
    } finally {
      setIsLoading(false);
    }
  };

  // Show email instructions dialog
  const handleShowEmailInstructions = () => {
    setShowEmailInstructions(true);
  };

  // Start processing after user confirms they've forwarded the email
  const handleEmailForwarded = () => {
    setShowEmailInstructions(false);
    setProcessingEmail(true);
    setProcessingStep(0);
    
    // Simulate processing time with incremental steps to show progress
    const stepInterval = 700; // Time between steps in ms
    
    // Process each step with a delay to simulate real-time processing
    const processSteps = async (currentStep: number) => {
      if (currentStep < processingSteps.length) {
        setProcessingStep(currentStep);
        setTimeout(() => processSteps(currentStep + 1), stepInterval);
      } else {
        // All steps complete, create the customer and redirect
        try {
          // Create the customer in the database
          const newCustomer = await createCustomer({
            name: 'First Customer, Inc.',
            email_domain: 'firstcustomer.com'
          });
          
          setProcessingEmail(false);
          
          // Update the customers list
          await fetchCustomers();
          
          // Redirect to the new customer's orders page
          router.push(`/dashboard/tools/truck-loading-helper/customer/${newCustomer.id}/orders`);
        } catch (error) {
          console.error('Error creating customer:', error);
          setError('Failed to create customer. Please try again.');
          setProcessingEmail(false);
        }
      }
    };
    
    // Start the processing sequence
    processSteps(0);
  };

  // Filter customers based on search query
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email_domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Manage your customers and their orders
          </p>
        </div>
        
        <Button onClick={handleShowEmailInstructions}>
          <Mail className="mr-2 h-4 w-4" />
          Add Customer via Email
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading customers...</p>
        </div>
      ) : customers.length === 0 ? (
        <div className="text-center py-12">
          <Mail className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No Customers Yet</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Forward your first order email to get started.
          </p>
          <Button onClick={handleShowEmailInstructions}>
            <Mail className="mr-2 h-4 w-4" />
            Forward Order Email
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id}>
                <CardHeader>
                  <CardTitle>{customer.name}</CardTitle>
                  <CardDescription>{customer.email_domain}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/dashboard/tools/truck-loading-helper/customer/${customer.id}/orders`)}
                  >
                    View Orders
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Email Instructions Dialog */}
      <Dialog open={showEmailInstructions} onOpenChange={setShowEmailInstructions}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Forward Order Email</DialogTitle>
            <DialogDescription>
              Follow these steps to add your first customer:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Forward Your Order Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Forward your order email to <strong>orders@onusphere.com</strong>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Include Customer ID</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Add <code className="px-1 py-0.5 bg-gray-100 dark:bg-gray-800 rounded">[CUSTOMER_ID]</code> to the subject line
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Wait for Processing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We'll automatically process your email and add the customer
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowEmailInstructions(false)}>
                Cancel
              </Button>
              <Button onClick={handleEmailForwarded}>
                <Send className="mr-2 h-4 w-4" />
                I've Forwarded the Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Processing Dialog */}
      {processingEmail && (
        <Dialog open>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Processing Email</DialogTitle>
              <DialogDescription>
                Please wait while we process your order email...
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                {processingSteps.map((step, index) => (
                  <div
                    key={step}
                    className={`flex items-center gap-2 ${
                      index < processingStep
                        ? 'text-green-600'
                        : index === processingStep
                        ? 'text-primary'
                        : 'text-gray-400'
                    }`}
                  >
                    {index < processingStep ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : index === processingStep ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
} 