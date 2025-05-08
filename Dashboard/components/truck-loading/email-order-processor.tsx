'use client';

import { useState } from 'react';
import { 
  Mail, 
  Info, 
  Copy, 
  Check,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface EmailOrderProcessorProps {
  className?: string;
}

export default function EmailOrderProcessor({ className }: EmailOrderProcessorProps) {
  const [copied, setCopied] = useState(false);
  const emailAddress = 'orders@onusphere.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`w-full ${className}`}>
          <Mail className="mr-2 h-4 w-4" />
          Email Order Instructions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Email Order Processing</DialogTitle>
          <DialogDescription>
            Learn how to easily add new orders using email
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="instructions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>
          
          <TabsContent value="instructions" className="space-y-4 pt-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertTitle>Quick Setup</AlertTitle>
              <AlertDescription>
                Forward your supplier order emails to our system to automatically add them to the customer's account.
              </AlertDescription>
            </Alert>
            
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">Step 1: Forward order emails</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Simply forward any order confirmation emails to:
                </p>
                <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 p-2 rounded">
                  <code className="text-sm font-mono">{emailAddress}</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={handleCopyEmail}
                    className="h-8 px-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">Step 2: Wait for processing</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our system automatically extracts order information and associates it with the relevant customer. 
                  Orders typically appear within 5 minutes of forwarding the email.
                </p>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">Step 3: Review &amp; manage orders</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Once processed, orders will appear in the customer's order list with a "Pending" status.
                  You can then update the status as needed.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="faq" className="space-y-4 pt-4">
            <div className="space-y-4">
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">Which email formats are supported?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our system can process most standard order confirmation emails. For best results, forward the original 
                  email without modifications.
                </p>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">How are orders matched to customers?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Orders are matched to customers based on the email content, order number, and customer information 
                  patterns. The system learns from previous matches to improve accuracy.
                </p>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">What if an order isn't processed correctly?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  If an order doesn't appear after 10 minutes, you can manually add it through the "Add Order" 
                  function in the customer detail page.
                </p>
              </div>
              
              <div className="rounded-md border p-4">
                <h3 className="text-sm font-medium mb-2">Can I forward past order emails?</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Yes, you can forward past order emails to populate the system with historical data. The 
                  order dates will be preserved from the email content.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={handleCopyEmail}>
            {copied ? 'Email Copied!' : 'Copy Email Address'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
