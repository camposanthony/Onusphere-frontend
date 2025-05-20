"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Mail,
  Loader2,
  AlertCircle,
  Send,
  CheckCircle2,
  ClipboardCopy,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CustomerCard from "@/components/customers/CustomerCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getCustomers,
  Customer,
  getCustomerOrders,
  BackendOrder,
} from "@/lib/services/load-plan-pro-api";
import { getCompanyCode } from "@/lib/services/users";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // State for refresh operation
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showEmailInstructions, setShowEmailInstructions] = useState(false);

  const [companyCode, setCompanyCode] = useState<string | null>(null);
  const [isLoadingCompanyCode, setIsLoadingCompanyCode] = useState(true);
  const [isCodeCopied, setIsCodeCopied] = useState(false);
  const [isCodeCopied2, setIsCodeCopied2] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState<Date | null>(null);

  // Fetch customers and their incomplete order counts
  const fetchCustomersWithIncompleteCounts = async () => {
    setIsLoading(true);
    try {
      const customerList = await getCustomers();
      // Fetch orders for all customers in parallel
      const customersWithCounts = await Promise.all(
        customerList.map(async (customer) => {
          let incompleteOrderCount = 0;
          try {
            const orders: BackendOrder[] = await getCustomerOrders(customer.id);
            incompleteOrderCount = orders.filter(
              (order) => order.status === "incomplete",
            ).length;
          } catch {
            // If fetching orders fails, just leave count as 0
          }
          return { ...customer, incompleteOrderCount };
        }),
      );
      setCustomers(customersWithCounts);
      setLastRefreshTime(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load customers");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const initialLoad = async () => {
      setIsLoadingCompanyCode(true);
      try {
        await fetchCustomersWithIncompleteCounts();
        const code = await getCompanyCode();
        setCompanyCode(code);
      } catch (err) {
        console.error("Error during initial load:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load page data",
        );
      } finally {
        setIsLoadingCompanyCode(false);
      }
    };
    initialLoad();
  }, []);

  const refreshCustomerList = async () => {
    if (isRefreshing) return;
    try {
      setIsRefreshing(true);
      await fetchCustomersWithIncompleteCounts();
      setLastRefreshTime(new Date());
      if (error?.includes("Failed to load customers")) {
        setError(null);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to refresh customers",
      );
    } finally {
      setIsRefreshing(false);
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
        setIsCodeCopied2(true);
        setTimeout(() => setIsCodeCopied(false), 2000);
        setTimeout(() => setIsCodeCopied2(false), 2000);
      } catch (err) {
        console.error("Failed to copy company code:", err);
        // Optionally set an error state to inform the user
      }
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.email_domain &&
        customer.email_domain
          .toLowerCase()
          .includes(searchQuery.toLowerCase())),
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

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={refreshCustomerList}
            disabled={isRefreshing || isLoading}
            className="relative"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button onClick={handleShowEmailInstructions} disabled={isLoading}>
            <Mail className="mr-2 h-4 w-4" />
            Add Customer via Email
          </Button>
        </div>
      </div>

      {/* Last refresh time indicator */}
      {lastRefreshTime && (
        <p className="text-xs text-gray-500 mb-4">
          Last updated: {lastRefreshTime.toLocaleTimeString()}
        </p>
      )}

      {/* General error display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Main content with potential loading overlay */}
      <div className="relative">
        {/* Full page loading overlay for initial data fetch */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 z-20 flex items-center justify-center rounded-lg">
            <div className="flex flex-col items-center gap-3 bg-background p-6 rounded-lg shadow-sm">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading customer data...</p>
            </div>
          </div>
        )}

        {/* Loading and Empty States */}
        {isLoading && customers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-gray-600 dark:text-gray-300">
              Loading customers...
            </p>
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
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Refreshing overlay */}
            <div className="relative">
              {isRefreshing && (
                <div className="absolute inset-0 bg-background/80 z-10 flex items-center justify-center rounded-lg">
                  <div className="flex flex-col items-center gap-2 bg-background p-4 rounded-lg shadow-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">
                      Updating customer list...
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.map((customer) => (
                  <CustomerCard
                    key={customer.id}
                    customer={customer}
                    isLoading={isLoading || isRefreshing}
                    onNameUpdate={(id, newName) => {
                      setCustomers((prev) =>
                        prev.map((c) =>
                          c.id === id ? { ...c, name: newName } : c,
                        ),
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Email Instructions Dialog */}
      <Dialog
        open={showEmailInstructions}
        onOpenChange={setShowEmailInstructions}
      >
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
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">1</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Forward Your Order Email</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Forward your order email to
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    <>
                      <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                        onusphere@gmail.com
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyCode}
                        className="px-2 py-1 h-auto text-xs"
                      >
                        {isCodeCopied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                            <span className="text-green-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">2</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">
                    Include Company Code in Subject
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Add your company code to the email subject line.
                  </p>
                  <div className="mt-1 flex items-center gap-2">
                    {isLoadingCompanyCode ? (
                      <span className="italic text-sm">Loading code...</span>
                    ) : companyCode ? (
                      <>
                        <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm">
                          {companyCode}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleCopyCode}
                          className="px-2 py-1 h-auto text-xs"
                        >
                          {isCodeCopied2 ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1 text-green-500" />
                              <span className="text-green-500">Copied!</span>
                            </>
                          ) : (
                            <>
                              <ClipboardCopy className="h-3.5 w-3.5 mr-1" />
                              <span>Copy</span>
                            </>
                          )}
                        </Button>
                      </>
                    ) : (
                      <span className="italic text-red-500 text-sm">
                        Company code not available
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-semibold">3</span>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Wait for Processing</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    We&apos;ll automatically process your email and add the
                    customer.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowEmailInstructions(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowEmailInstructions(false);
                  // Will auto-refresh after interval to check for new customer
                }}
              >
                <Send className="mr-2 h-4 w-4" />
                I&apos;ve Forwarded the Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
