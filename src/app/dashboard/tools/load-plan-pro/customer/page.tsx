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
  Users,
  Sparkles,
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showEmailInstructions, setShowEmailInstructions] = useState(false);

  const [companyCode, setCompanyCode] = useState<string | null>(null);
  const [isLoadingCompanyCode, setIsLoadingCompanyCode] = useState(true);
  const [isCodeCopied2, setIsCodeCopied2] = useState(false);
  const [isEmailCopied, setIsEmailCopied] = useState(false);
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
    setError(null);
    setShowEmailInstructions(true);
  };

  const handleCopyCode = async () => {
    if (companyCode) {
      try {
        await navigator.clipboard.writeText(companyCode);
        setIsCodeCopied2(true);
        setTimeout(() => setIsCodeCopied2(false), 2000);
      } catch (err) {
        console.error("Failed to copy company code:", err);
      }
    }
  };

  const handleCopyEmail = async () => {
    const email = "onusphere@gmail.com";
    try {
      await navigator.clipboard.writeText(email);
      setIsEmailCopied(true);
      setTimeout(() => setIsEmailCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy email:", err);
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
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    Customer Management
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Manage your customers and their load planning orders
                  </p>
                </div>
              </div>
              
              {/* Stats Section */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {customers.length} Total Customers
                    </span>
                  </div>
                </div>
                {totalIncompleteOrders > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        {totalIncompleteOrders} Incomplete Orders
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={refreshCustomerList}
                disabled={isRefreshing || isLoading}
                className="relative h-11 px-6 bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <RefreshCw
                  className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
                Refresh Data
              </Button>

              <Button 
                onClick={handleShowEmailInstructions} 
                disabled={isLoading}
                className="h-11 px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200"
              >
                <Mail className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </div>
          </div>

          {/* Last refresh indicator */}
          {lastRefreshTime && (
            <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div>
              <span>Last updated: {lastRefreshTime.toLocaleTimeString()}</span>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-3 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="relative">
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
              <div className="flex flex-col items-center gap-4 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary/20"></div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Loading customer data...</p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && customers.length === 0 && !error ? (
            <div className="text-center py-16">
              <div className="mx-auto w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mb-6 shadow-inner">
                <Mail className="h-16 w-16 text-slate-400 dark:text-slate-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                No Customers Yet
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 max-w-md mx-auto">
                Get started by forwarding your first order email to automatically create your customer database.
              </p>
              <Button 
                onClick={handleShowEmailInstructions}
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              >
                <Mail className="mr-2 h-5 w-5" />
                Forward Order Email
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
                <div className="relative max-w-md">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Search customers by name or domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-11 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg"
                    disabled={isLoading}
                  />
                </div>
                {searchQuery && (
                  <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
                    {filteredCustomers.length} of {customers.length} customers
                  </div>
                )}
              </div>

              {/* Customer Grid */}
              <div className="relative">
                {/* Refreshing Overlay */}
                {isRefreshing && (
                  <div className="absolute inset-0 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                    <div className="flex flex-col items-center gap-3 bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      <p className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                        Updating customer data...
                      </p>
                    </div>
                  </div>
                )}

                {filteredCustomers.length === 0 && searchQuery ? (
                  <div className="text-center py-12">
                    <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Search className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No customers found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Try adjusting your search terms
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Email Instructions Dialog */}
      <Dialog
        open={showEmailInstructions}
        onOpenChange={setShowEmailInstructions}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              Add New Customer
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600 dark:text-slate-400">
              Follow these simple steps to automatically add a customer by forwarding their order email
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-8 py-6">
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">1</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                    Forward Order Email
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    Forward any order email from your customer to our processing address
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <code className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 rounded-md text-sm font-mono border border-slate-200 dark:border-slate-600">
                        onusphere@gmail.com
                      </code>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyEmail}
                        className="flex-shrink-0"
                      >
                        {isEmailCopied ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                            <span className="text-green-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <ClipboardCopy className="h-4 w-4 mr-2" />
                            Copy Email
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">2</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                    Include Company Code
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 mb-3">
                    Add your company code to the email subject line so we can route it correctly
                  </p>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                    {isLoadingCompanyCode ? (
                      <div className="flex items-center gap-3">
                        <div className="animate-pulse bg-slate-200 dark:bg-slate-600 h-9 rounded-md flex-1"></div>
                        <span className="text-sm text-slate-500">Loading...</span>
                      </div>
                    ) : companyCode ? (
                      <div className="flex items-center gap-3">
                        <code className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 rounded-md text-sm font-mono border border-slate-200 dark:border-slate-600">
                          {companyCode}
                        </code>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopyCode}
                          className="flex-shrink-0"
                        >
                          {isCodeCopied2 ? (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                              <span className="text-green-600">Copied!</span>
                            </>
                          ) : (
                            <>
                              <ClipboardCopy className="h-4 w-4 mr-2" />
                              Copy Code
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-red-600 dark:text-red-400 font-medium">
                        Company code not available
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">3</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg mb-2 text-slate-900 dark:text-white">
                    Automatic Processing
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400">
                    We'll automatically process the email, extract customer and order information, and add them to your dashboard within minutes.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="outline"
                onClick={() => setShowEmailInstructions(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setShowEmailInstructions(false);
                }}
                className="px-6 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
              >
                <Send className="mr-2 h-4 w-4" />
                I've Sent the Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
