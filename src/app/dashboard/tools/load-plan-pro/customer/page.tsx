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
  ClipboardCopy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  getCustomers, 
  Customer
} from '@/lib/services/load-plan-pro-api';
import { getCompanyCode } from '@/lib/services/users'; 

export default function CustomersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true); 
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showEmailInstructions, setShowEmailInstructions] = useState(false);
  
  const [companyCode, setCompanyCode] = useState<string | null>(null);
  const [isLoadingCompanyCode, setIsLoadingCompanyCode] = useState(true);
  const [isCodeCopied, setIsCodeCopied] = useState(false); 

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoading(true); 
      setIsLoadingCompanyCode(true); 
      try {
        const fetchedCustomers = await getCustomers();
        setCustomers(fetchedCustomers);
        const code = await getCompanyCode();
        setCompanyCode(code);
      } catch (err) {
        console.error('Error during initial load:', err);
        setError(err instanceof Error ? err.message : 'Failed to load page data');
      } finally {
        setIsLoading(false);
        setIsLoadingCompanyCode(false);
      }
    };
    initialLoad();
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

  const handleShowEmailInstructions = () => {
    setError(null); // Clear general errors
    setShowEmailInstructions(true);
  };

  const handleCopyCode = async () => {
    if (companyCode) {
      try {
        await navigator.clipboard.writeText(companyCode);
        setIsCodeCopied(true);
        setTimeout(() => setIsCodeCopied(false), 2000); 
      } catch (err) {
        console.error('Failed to copy company code:', err);
        // Optionally set an error state to inform the user
      }
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.email_domain && customer.email_domain.toLowerCase().includes(searchQuery.toLowerCase()))
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

      {/* General error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Loading and Empty States */}
      {isLoading && customers.length === 0 ? ( 
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-gray-600 dark:text-gray-300">Loading customers...</p>
        </div>
      ) : !isLoading && customers.length === 0 && !error ? ( 
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
                    onClick={() => router.push(`/dashboard/tools/load-plan-pro/customer/${customer.id}/orders`)}
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
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary font-semibold">1</span></div>
                <div>
                  <h4 className="font-medium mb-1">Forward Your Order Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Forward your order email to</p>
                <div className="mt-1 flex items-center gap-2">
                      <><code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">onusphere@gmail.com</code>
                        <Button variant="ghost" size="sm" onClick={handleCopyCode} className="px-2 py-1 h-auto text-xs">
                          {isCodeCopied ? (<><CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" /><span className="text-green-500">Copied!</span></>) 
                          : (<><ClipboardCopy className="h-3.5 w-3.5 mr-1" /><span>Copy</span></>)}
                        </Button></>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary font-semibold">2</span></div>
                <div>
                  <h4 className="font-medium mb-1">Include Company Code in Subject</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Add your company code to the email subject line.</p>
                  <div className="mt-1 flex items-center gap-2">
                    {isLoadingCompanyCode ? (<span className="italic text-sm">Loading code...</span>) 
                    : companyCode ? (
                      <><code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">{companyCode}</code>
                        <Button variant="ghost" size="sm" onClick={handleCopyCode} className="px-2 py-1 h-auto text-xs">
                          {isCodeCopied ? (<><CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" /><span className="text-green-500">Copied!</span></>) 
                          : (<><ClipboardCopy className="h-3.5 w-3.5 mr-1" /><span>Copy</span></>)}
                        </Button></>
                    ) : (<span className="italic text-red-500 text-sm">Company code not available</span>)}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"><span className="text-primary font-semibold">3</span></div>
                <div><h4 className="font-medium mb-1">Wait for Processing</h4><p className="text-sm text-gray-600 dark:text-gray-300">We'll automatically process your email and add the customer.</p></div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setShowEmailInstructions(false)}>Cancel</Button>
              <Button onClick={() => setShowEmailInstructions(false)}>
                <Send className="mr-2 h-4 w-4" />
                I've Forwarded the Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}