"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import {
  Search,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ArrowRight,
  Download,
  FileText,
  Package,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  getCustomerById,
  getCustomerOrders,
  updateItemDimensions,
  triggerPackingTool,
  Customer,
  BackendOrder,
} from "@/lib/services/load-plan-pro-api";
import { toast } from "sonner";

type ItemWithDimensions = {
  item_id: string;
  item_number?: string;
  description?: string;
  height: number;
  width: number;
  length: number;
  [key: string]: unknown;
};

type OrderBatchWithTypedItem = {
  order_batch_id: string;
  number_pallets: number;
  item?: ItemWithDimensions | null;
  [key: string]: unknown;
};

export default function CustomerPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Track if we should show the orders tab after "back"
  const [forceOrdersTab, setForceOrdersTab] = useState(false);

  // Common state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<BackendOrder[]>([]);

  // Orders tab state
  const [ordersSearchQuery, setOrdersSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemEdits, setItemEdits] = useState<
    Record<string, { height: string; width: string; length: string }>
  >({});
  const [itemsToSave, setItemsToSave] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [modalPage, setModalPage] = useState(0);
  const [editFields, setEditFields] = useState<{
    height: string;
    width: string;
    length: string;
  }>({ height: "", width: "", length: "" });
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ItemWithDimensions | null>(null);
  const [justSavedItemId, setJustSavedItemId] = useState<string | null>(null);
  const [swipingItemId, setSwipingItemId] = useState<string | null>(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);

  // Master sheet state
  const [masterSearchQuery, setMasterSearchQuery] = useState("");
  const [masterStatusFilter, setMasterStatusFilter] = useState<string>("all");

  // Tab state
  const [activeTab, setActiveTab] = useState("overview");

  // Calculate items per page based on viewport size
  const calculateItemsPerPage = () => {
    if (typeof window === "undefined") return 9;

    const viewportHeight = window.innerHeight;
    const modalMaxHeight = viewportHeight * 0.9;
    const headerHeight = 120;
    const paginationHeight = 80;
    const availableHeight = modalMaxHeight - headerHeight - paginationHeight;

    const itemHeight =
      window.innerWidth < 640 ? 160 : window.innerWidth < 1024 ? 180 : 200;

    const cols = window.innerWidth < 640 ? 1 : window.innerWidth < 1024 ? 2 : 3;

    const gap = window.innerWidth < 640 ? 8 : 16;
    const rows = Math.max(
      1,
      Math.floor((availableHeight + gap) / (itemHeight + gap)),
    );

    return Math.max(1, rows * cols);
  };

  // Update items per page on window resize
  useEffect(() => {
    const updateItemsPerPage = () => {
      const newItemsPerPage = calculateItemsPerPage();
      setItemsPerPage(newItemsPerPage);

      if (selectedOrder) {
        const sortedBatches = getSortedBatches(selectedOrder);
        const newTotalPages = Math.ceil(sortedBatches.length / newItemsPerPage);
        if (modalPage >= newTotalPages) {
          setModalPage(Math.max(0, newTotalPages - 1));
        }
      }
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedUpdate = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateItemsPerPage, 100);
    };

    updateItemsPerPage();
    window.addEventListener("resize", debouncedUpdate);

    return () => {
      window.removeEventListener("resize", debouncedUpdate);
      clearTimeout(timeoutId);
    };
  }, [modalPage, selectedOrder]);

  useEffect(() => {
    fetchCustomerAndOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  // Handle URL tab parameters
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab && ["overview", "orders", "master-sheet"].includes(tab)) {
      setActiveTab(tab);
    }

    const filter = searchParams.get("filter");
    if (filter === "complete") {
      setStatusFilter("done");
      setActiveTab("orders");
    } else if (filter === "incomplete") {
      setStatusFilter("incomplete");
      setActiveTab("orders");
    }
  }, [searchParams]);

  // If forceOrdersTab is set, switch to orders tab and reset flag
  useEffect(() => {
    if (forceOrdersTab) {
      setActiveTab("orders");
      setForceOrdersTab(false);
    }
  }, [forceOrdersTab]);

  const fetchCustomerAndOrders = async () => {
    try {
      setIsLoading(true);
      const customerId = params.id as string;
      const [customerData, ordersData] = await Promise.all([
        getCustomerById(customerId),
        getCustomerOrders(customerId),
      ]);
      setCustomer(customerData);
      setOrders(ordersData);

      if (selectedOrder && modalOpen) {
        const updatedOrder = ordersData.find(
          (order) => order.id === selectedOrder.id,
        );
        if (updatedOrder) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (err) {
      console.error("Error fetching customer and orders:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load customer data",
      );
      toast.error("Failed to load customer data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomerAndOrdersSilent = async () => {
    try {
      const customerId = params.id as string;
      const [customerData, ordersData] = await Promise.all([
        getCustomerById(customerId),
        getCustomerOrders(customerId),
      ]);
      setCustomer(customerData);
      setOrders(ordersData);

      if (selectedOrder && modalOpen) {
        const updatedOrder = ordersData.find(
          (order) => order.id === selectedOrder.id,
        );
        if (
          updatedOrder &&
          updatedOrder.order_batches.length !==
            selectedOrder.order_batches.length
        ) {
          setSelectedOrder(updatedOrder);
        }
      }
    } catch (err) {
      console.error("Error fetching customer and orders:", err);
    }
  };

  // Extract all unique items from all orders
  const getUniqueItems = (): ItemWithDimensions[] => {
    const allItems = new Map<string, ItemWithDimensions>();

    orders.forEach((order) => {
      order.order_batches?.forEach((batch) => {
        const item = batch.item as unknown as ItemWithDimensions | undefined;
        if (item && item.item_id) {
          allItems.set(item.item_id, item);
        }
      });
    });

    return Array.from(allItems.values());
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(ordersSearchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Filter items for master sheet
  const filteredItems = getUniqueItems().filter((item) => {
    const matchesSearch =
      item.item_number
        ?.toLowerCase()
        .includes(masterSearchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(masterSearchQuery.toLowerCase());

    const isComplete = item.height > 0 && item.width > 0 && item.length > 0;
    const matchesStatus =
      masterStatusFilter === "all" ||
      (masterStatusFilter === "complete" && isComplete) ||
      (masterStatusFilter === "incomplete" && !isComplete);

    return matchesSearch && matchesStatus;
  });

  const getSortedBatches = (order: BackendOrder) => {
    if (!order.order_batches) return [];
    const batches = order.order_batches as OrderBatchWithTypedItem[];
    return [...batches].sort((a, b) => {
      const aMissing =
        !a.item ||
        a.item.height === 0 ||
        a.item.width === 0 ||
        a.item.length === 0;
      const bMissing =
        !b.item ||
        b.item.height === 0 ||
        b.item.width === 0 ||
        b.item.length === 0;
      return aMissing === bMissing ? 0 : aMissing ? -1 : 1;
    });
  };

  const handleOrderCardClick = (order: BackendOrder) => {
    setSelectedOrder(order);
    setModalOpen(true);
    setItemEdits({});
  };

  const handleSubmitAll = async () => {
    setSubmitting(true);
    try {
      await Promise.all(
        itemsToSave.map(async (itemId) => {
          const edit = itemEdits[itemId];
          if (edit && edit.height && edit.width && edit.length) {
            await updateItemDimensions(itemId, {
              height: parseFloat(edit.height),
              width: parseFloat(edit.width),
              length: parseFloat(edit.length),
            });
          }
        }),
      );

      // Trigger the packing tool after successfully updating all dimensions
      if (selectedOrder) {
        try {
          await triggerPackingTool(selectedOrder.id);
          toast.success(
            "All item dimensions updated and packing tool triggered!",
          );
        } catch (error) {
          console.error("Failed to trigger packing tool:", error);
          toast.success("All item dimensions updated!");
          toast.error("Failed to trigger packing tool");
        }
      } else {
        toast.success("All item dimensions updated!");
      }

      setModalOpen(false);
      await fetchCustomerAndOrders();
    } catch {
      toast.error("Failed to update some item dimensions");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCard = (itemId: string, item: ItemWithDimensions) => {
    setEditFields({
      height: item.height !== undefined ? String(item.height) : "",
      width: item.width !== undefined ? String(item.width) : "",
      length: item.length !== undefined ? String(item.length) : "",
    });
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleEditFieldChange = (field: string, value: string) => {
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setEditFields((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveEdit = async (itemId: string) => {
    setSavingItemId(itemId);
    try {
      await updateItemDimensions(itemId, {
        height: parseFloat(editFields.height),
        width: parseFloat(editFields.width),
        length: parseFloat(editFields.length),
      });
      toast.success("Item dimensions updated!");
      setEditModalOpen(false);
      setEditItem(null);
      setJustSavedItemId(itemId);

      // Refresh itemsToSave and itemEdits after saving
      if (selectedOrder) {
        // Find the updated order from the latest orders state
        const updatedOrder =
          orders.find((order) => order.id === selectedOrder.id) ||
          selectedOrder;
        // Recalculate edits and itemsToSave
        const edits: Record<
          string,
          { height: string; width: string; length: string }
        > = {};
        const toSave: string[] = [];
        updatedOrder.order_batches.forEach((batch) => {
          const item = batch.item as unknown;
          if (
            item &&
            typeof item === "object" &&
            "item_id" in item &&
            "height" in item &&
            "width" in item &&
            "length" in item
          ) {
            const typedItem = item as ItemWithDimensions;
            if (
              typedItem.height === 0 ||
              typedItem.width === 0 ||
              typedItem.length === 0
            ) {
              edits[typedItem.item_id] = {
                height: typedItem.height ? String(typedItem.height) : "",
                width: typedItem.width ? String(typedItem.width) : "",
                length: typedItem.length ? String(typedItem.length) : "",
              };
              toSave.push(typedItem.item_id);
            }
          }
        });
        setItemEdits(edits);
        setItemsToSave(toSave);
      }

      setTimeout(() => {
        setJustSavedItemId(null);
        setSwipingItemId(itemId);
        setTimeout(async () => {
          setSwipingItemId(null);

          if (selectedOrder) {
            const updatedBatches = selectedOrder.order_batches.filter(
              (batch) => batch.item?.item_id !== itemId,
            );
            setSelectedOrder({
              ...selectedOrder,
              order_batches: updatedBatches,
            });
          }

          fetchCustomerAndOrdersSilent();
        }, 400);
      }, 1000);
    } catch {
      toast.error("Failed to update item dimensions");
    } finally {
      setSavingItemId(null);
    }
  };

  const handleCancelEdit = () => {
    setEditModalOpen(false);
    setEditItem(null);
  };

  const handleEditFromMasterSheet = (item: ItemWithDimensions) => {
    setEditFields({
      height: item.height !== undefined ? String(item.height) : "",
      width: item.width !== undefined ? String(item.width) : "",
      length: item.length !== undefined ? String(item.length) : "",
    });
    setEditItem(item);
    setEditModalOpen(true);
  };

  const handleSaveEditFromMasterSheet = async (itemId: string) => {
    setSavingItemId(itemId);
    try {
      await updateItemDimensions(itemId, {
        height: parseFloat(editFields.height),
        width: parseFloat(editFields.width),
        length: parseFloat(editFields.length),
      });
      toast.success("Item dimensions updated!");
      setEditModalOpen(false);
      setEditItem(null);

      // Refresh customer and orders data to update the master sheet
      await fetchCustomerAndOrders();
    } catch {
      toast.error("Failed to update item dimensions");
    } finally {
      setSavingItemId(null);
    }
  };

  const handleExport = () => {
    const csvContent = [
      ["Item Number", "Height (in)", "Width (in)", "Length (in)", "Status"],
      ...filteredItems.map((item) => [
        item.item_number || "N/A",
        item.height?.toString() || "N/A",
        item.width?.toString() || "N/A",
        item.length?.toString() || "N/A",
        item.height > 0 && item.width > 0 && item.length > 0
          ? "Complete"
          : "Incomplete",
      ]),
    ]
      .map((row) => row.map((field) => `"${field}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${customer?.name || "customer"}_master_sheet.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Initialize edits for missing items
  useEffect(() => {
    if (selectedOrder) {
      const edits: Record<
        string,
        { height: string; width: string; length: string }
      > = {};
      const toSave: string[] = [];
      selectedOrder.order_batches.forEach((batch) => {
        const item = batch.item as unknown;
        if (
          item &&
          typeof item === "object" &&
          "item_id" in item &&
          "height" in item &&
          "width" in item &&
          "length" in item
        ) {
          const typedItem = item as ItemWithDimensions;
          if (
            typedItem.height === 0 ||
            typedItem.width === 0 ||
            typedItem.length === 0
          ) {
            edits[typedItem.item_id] = {
              height: typedItem.height ? String(typedItem.height) : "",
              width: typedItem.width ? String(typedItem.width) : "",
              length: typedItem.length ? String(typedItem.length) : "",
            };
            toSave.push(typedItem.item_id);
          }
        }
      });
      setItemEdits(edits);
      setItemsToSave(toSave);
    }
  }, [selectedOrder]);

  useEffect(() => {
    setModalPage(0);
  }, [modalOpen, selectedOrder]);

  // Helper: Go to orders tab (used for back button)
  const goToOrdersTab = () => {
    setActiveTab("orders");
    // Optionally, scroll to top or focus orders section if needed
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    // If coming from loading plan, go to orders tab
                    if (
                      searchParams.get("tab") === "orders" ||
                      forceOrdersTab
                    ) {
                      setActiveTab("orders");
                      router.replace(`?tab=orders`);
                    } else {
                      router.back();
                    }
                  }}
                  className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800 -ml-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {searchParams.get("tab") === "orders" || forceOrdersTab
                    ? "Back to Orders"
                    : "Back to Customers"}
                </Button>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      Loading...
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading/Error States */}
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary/20"></div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                Loading customer data...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    if (
                      searchParams.get("tab") === "orders" ||
                      forceOrdersTab
                    ) {
                      goToOrdersTab();
                    } else {
                      router.back();
                    }
                  }}
                  className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800 -ml-4"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Customers
                </Button>

                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    <Package className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                      {customer?.name || "Loading..."}
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Loading/Error States */}
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <div className="flex items-center gap-3 text-red-800 dark:text-red-200">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto py-6">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-300">Customer not found</p>
        </div>
      </div>
    );
  }

  const completeOrders = orders.filter((order) => order.status === "done");
  const incompleteOrders = orders.filter(
    (order) => order.status === "incomplete" || order.status === "processing",
  );
  const uniqueItems = getUniqueItems();
  const completeItems = uniqueItems.filter(
    (item) => item.height > 0 && item.width > 0 && item.length > 0,
  );
  const completeCount = filteredItems.filter(
    (item) => item.height > 0 && item.width > 0 && item.length > 0,
  ).length;
  const incompleteCount = filteredItems.length - completeCount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <Button
                variant="ghost"
                onClick={() => {
                  // If coming from loading plan, go to orders tab
                  if (searchParams.get("tab") === "orders" || forceOrdersTab) {
                    goToOrdersTab();
                  } else {
                    router.back();
                  }
                }}
                className="mb-4 hover:bg-slate-100 dark:hover:bg-slate-800 -ml-4"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Customers
              </Button>

              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Package className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    {customer?.name || "Loading..."}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    {customer?.email_domain || ""}
                  </p>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {completeOrders.length} Complete Orders
                    </span>
                  </div>
                </div>
                {incompleteOrders.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        {incompleteOrders.length} Orders Need Action
                      </span>
                    </div>
                  </div>
                )}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl px-4 py-3 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                      {uniqueItems.length} Unique Items
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Loading/Error States */}
        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4 bg-white dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700">
              <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="absolute inset-0 h-12 w-12 rounded-full border-4 border-primary/20"></div>
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-medium">
                Loading customer data...
              </p>
            </div>
          </div>
        )}

        {!isLoading && customer && (
          <Tabs
            value={activeTab}
            onValueChange={(tab) => {
              setActiveTab(tab);
              router.replace(`?tab=${tab}`);
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="orders"
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
              >
                Orders
              </TabsTrigger>
              <TabsTrigger
                value="master-sheet"
                className="data-[state=active]:bg-primary data-[state=active]:text-white font-medium"
              >
                Master Sheet
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6 mt-8">
              {/* Overview Dashboard */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Complete Orders Section */}
                <Card className="shadow-none hover:shadow-none transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-green-700 dark:text-green-300 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-green-100 dark:bg-green-800 flex items-center justify-center">
                          <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        Complete Orders
                      </CardTitle>
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                        {completeOrders.length}
                      </div>
                    </div>
                    <CardDescription className="text-green-600/80 dark:text-green-400/80">
                      Orders that have been fully processed and completed
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <div className="space-y-2 flex-1">
                      <div className="text-sm text-green-700 dark:text-green-300">
                        • All items have complete dimensions
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        • Ready for load planning
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300">
                        • No further action required
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white border-0"
                      onClick={() => {
                        setStatusFilter("done");
                        setActiveTab("orders");
                      }}
                    >
                      View Complete Orders
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Incomplete Orders Section */}
                <Card className="shadow-none hover:shadow-none transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-amber-700 dark:text-amber-300 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-amber-100 dark:bg-amber-800 flex items-center justify-center">
                          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        Orders Needing Action
                      </CardTitle>
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                        {incompleteOrders.length}
                      </div>
                    </div>
                    <CardDescription className="text-amber-600/80 dark:text-amber-400/80">
                      Orders that require dimension updates or other actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <div className="space-y-2 flex-1">
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        •{" "}
                        {incompleteOrders.reduce((total, order) => {
                          const incompleteItems =
                            order.order_batches?.filter((batch) => {
                              const item = batch.item as unknown as
                                | ItemWithDimensions
                                | undefined;
                              return (
                                item &&
                                (item.height === 0 ||
                                  item.width === 0 ||
                                  item.length === 0)
                              );
                            }).length || 0;
                          return total + incompleteItems;
                        }, 0)}{" "}
                        items need dimensions
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        • Requires immediate attention
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300">
                        • Update dimensions to complete
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 bg-amber-600 hover:bg-amber-700 text-white border-0"
                      onClick={() => {
                        setStatusFilter("incomplete");
                        setActiveTab("orders");
                      }}
                    >
                      View Incomplete Orders
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>

                {/* Master Sheet Section */}
                <Card className="shadow-none hover:shadow-none transition-all duration-200 cursor-pointer border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 flex flex-col">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-blue-700 dark:text-blue-300 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-800 flex items-center justify-center">
                          <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        Master Item Catalog
                      </CardTitle>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {uniqueItems.length}
                      </div>
                    </div>
                    <CardDescription className="text-blue-600/80 dark:text-blue-400/80">
                      Complete catalog of all unique items ordered by this
                      customer
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <div className="space-y-2 flex-1">
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        • {completeItems.length} items with complete dimensions
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        • {uniqueItems.length - completeItems.length} items need
                        dimensions
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        • Search, filter, and export capabilities
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white border-0"
                      onClick={() => setActiveTab("master-sheet")}
                    >
                      View Master Catalog
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6 mt-8">
              {/* Orders Management Section */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders..."
                      value={ordersSearchQuery}
                      onChange={(e) => setOrdersSearchQuery(e.target.value)}
                      className="pl-12 h-11 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px] h-11 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="done">Complete</SelectItem>
                      <SelectItem value="incomplete">Incomplete</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredOrders.length === 0 ? (
                <div className="text-center py-16">
                  <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <Package className="h-8 w-8 text-slate-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    No orders found
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Try adjusting your search terms or filters
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOrders.map((order) => (
                    <Card
                      key={order.id}
                      className="relative border border-slate-200 shadow-none dark:border-slate-700 transition-all duration-200 cursor-pointer bg-white dark:bg-slate-800 overflow-hidden group"
                      onClick={() => handleOrderCardClick(order)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
                              Order #{order.id.slice(0, 7)}...
                            </CardTitle>
                            <CardDescription className="text-slate-600 dark:text-slate-400 mt-1">
                              {new Date(order.order_date).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium shadow-sm ${
                              order.status === "incomplete"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                                : order.status === "processing"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                  : order.status === "done"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                                    : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between">
                          <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                            {order.order_batches?.length || 0} items
                          </div>
                          <div className="flex items-center gap-2">
                            {order.status === "done" &&
                              order.loading_instructions && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(
                                      `/dashboard/tools/load-plan-pro/loading-plan/${order.id}?customerId=${params.id}&tab=orders`,
                                    );
                                  }}
                                  className="h-8 px-3 text-xs bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800"
                                >
                                  <Truck className="h-3 w-3 mr-1" />
                                  View Plan
                                </Button>
                              )}
                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="master-sheet" className="space-y-6 mt-8">
              {/* Master Sheet Section */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                    <CardContent className="p-4">
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {uniqueItems.length}
                      </div>
                      <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">
                        Total Items
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                    <CardContent className="p-4">
                      <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                        {completeCount}
                      </div>
                      <div className="text-sm text-green-700 dark:text-green-300 font-medium">
                        Complete Items
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border-0 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
                    <CardContent className="p-4">
                      <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-1">
                        {incompleteCount}
                      </div>
                      <div className="text-sm text-amber-700 dark:text-amber-300 font-medium">
                        Need Dimensions
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Search items..."
                      value={masterSearchQuery}
                      onChange={(e) => setMasterSearchQuery(e.target.value)}
                      className="pl-12 h-11 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg"
                    />
                  </div>
                  <Select
                    value={masterStatusFilter}
                    onValueChange={setMasterStatusFilter}
                  >
                    <SelectTrigger className="w-[200px] h-11 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Items</SelectItem>
                      <SelectItem value="complete">Complete Items</SelectItem>
                      <SelectItem value="incomplete">
                        Need Dimensions
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleExport}
                    className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-11 px-6"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Package className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                      No items found
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Try adjusting your search terms or filters
                    </p>
                  </div>
                ) : (
                  <Card className="border-0">
                    <CardContent className="p-0">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="border-b bg-slate-50 dark:bg-slate-800">
                              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">
                                Item Number
                              </th>
                              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">
                                Height (in)
                              </th>
                              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">
                                Width (in)
                              </th>
                              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">
                                Length (in)
                              </th>
                              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">
                                Status
                              </th>
                              <th className="text-left p-4 font-semibold text-slate-900 dark:text-white">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredItems.map((item) => {
                              const isComplete =
                                item.height > 0 &&
                                item.width > 0 &&
                                item.length > 0;

                              return (
                                <tr
                                  key={item.item_id}
                                  className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                >
                                  <td className="p-4 font-medium text-slate-900 dark:text-white">
                                    {item.item_number || "N/A"}
                                  </td>
                                  <td className="p-4 text-slate-900 dark:text-white font-mono">
                                    {item.height || "N/A"}
                                  </td>
                                  <td className="p-4 text-slate-900 dark:text-white font-mono">
                                    {item.width || "N/A"}
                                  </td>
                                  <td className="p-4 text-slate-900 dark:text-white font-mono">
                                    {item.length || "N/A"}
                                  </td>
                                  <td className="p-4">
                                    {isComplete ? (
                                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M5 13l4 4L19 7"
                                          />
                                        </svg>
                                        Complete
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                                        <svg
                                          className="w-3 h-3"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle cx="12" cy="12" r="10" />
                                          <path d="M12 6v6l4 2" />
                                        </svg>
                                        Need Dimensions
                                      </span>
                                    )}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleEditFromMasterSheet(item);
                                        }}
                                      >
                                        Edit
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl max-h-[90vh] p-2 sm:p-6 flex flex-col overflow-hidden bg-white dark:bg-slate-800 border-0">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-xl font-bold text-slate-900 dark:text-white">
                Order #{selectedOrder.id.slice(0, 7)}... Details
              </DialogTitle>
              <DialogDescription className="text-slate-600 dark:text-slate-400">
                Order Date:{" "}
                {new Date(selectedOrder.order_date).toLocaleDateString()}
              </DialogDescription>
              {selectedOrder.status === "incomplete" &&
                (() => {
                  const incompleteCount = selectedOrder.order_batches.filter(
                    (batch) => {
                      const item = batch.item as unknown as
                        | ItemWithDimensions
                        | undefined;
                      return (
                        item &&
                        (item.height === 0 ||
                          item.width === 0 ||
                          item.length === 0)
                      );
                    },
                  ).length;

                  return (
                    <div className="mb-2 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-lg flex items-center gap-2">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        This order is incomplete. {incompleteCount} item
                        {incompleteCount !== 1 ? "s" : ""} need
                        {incompleteCount === 1 ? "s" : ""} dimension updates.
                      </span>
                    </div>
                  );
                })()}
            </DialogHeader>
            <div className="flex-1 overflow-hidden flex flex-col min-h-0">
              {(() => {
                const sortedBatches = getSortedBatches(selectedOrder);
                const totalPages = Math.ceil(
                  sortedBatches.length / itemsPerPage,
                );
                const pageBatches = sortedBatches.slice(
                  modalPage * itemsPerPage,
                  (modalPage + 1) * itemsPerPage,
                );

                const allItemsComplete = selectedOrder.order_batches.every(
                  (batch) => {
                    const item = batch.item as unknown as
                      | ItemWithDimensions
                      | undefined;
                    return (
                      item &&
                      item.height > 0 &&
                      item.width > 0 &&
                      item.length > 0
                    );
                  },
                );

                return (
                  <>
                    <div className="flex-1 overflow-hidden">
                      {(() => {
                        const visibleBatches = pageBatches.filter(
                          (batch) => batch.item?.item_id !== swipingItemId,
                        );
                        const swipingBatch = pageBatches.find(
                          (batch) => batch.item?.item_id === swipingItemId,
                        );
                        return (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 h-full auto-rows-fr">
                            {visibleBatches.map((batch) => {
                              const itemId = batch.item?.item_id || "";
                              const item = batch.item as
                                | ItemWithDimensions
                                | undefined;
                              const isJustSaved = justSavedItemId === itemId;
                              const isComplete =
                                item &&
                                item.height > 0 &&
                                item.width > 0 &&
                                item.length > 0;
                              return (
                                <div
                                  key={batch.order_batch_id}
                                  className={`border rounded p-2 sm:p-3 flex flex-col min-h-0 relative transition-colors duration-300 ${
                                    isJustSaved
                                      ? "bg-green-200"
                                      : isComplete
                                        ? "bg-green-50 border-green-200"
                                        : "bg-gray-50"
                                  }`}
                                >
                                  {isComplete && !isJustSaved && (
                                    <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                                      <svg
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          fill="none"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M7 13l3 3 7-7"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                  {isJustSaved && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                      <svg
                                        className="w-8 h-8 sm:w-12 sm:h-12 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="3"
                                        viewBox="0 0 24 24"
                                      >
                                        <circle
                                          cx="12"
                                          cy="12"
                                          r="10"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          fill="none"
                                        />
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M7 13l3 3 7-7"
                                        />
                                      </svg>
                                    </div>
                                  )}
                                  <div
                                    className={`flex flex-col flex-1 min-h-0 ${isJustSaved ? "opacity-40" : ""}`}
                                  >
                                    <div
                                      className="font-semibold mb-1 text-sm sm:text-base truncate max-w-[100px] sm:max-w-[140px]"
                                      title={
                                        item?.item_number || "Unknown Item"
                                      }
                                    >
                                      {item?.item_number || "Unknown Item"}
                                    </div>
                                    <div
                                      className="text-xs text-gray-500 mb-1 truncate max-w-[120px] sm:max-w-[160px]"
                                      title={
                                        item?.description || "No description"
                                      }
                                    >
                                      {item?.description || "No description"}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-1">
                                      Pallets: {batch.number_pallets}
                                    </div>
                                    <div className="text-xs text-gray-600 mt-2 flex flex-col gap-1 flex-1">
                                      <span>
                                        Height:{" "}
                                        {item && "height" in item
                                          ? String(item.height)
                                          : "N/A"}{" "}
                                        in
                                      </span>
                                      <span>
                                        Width:{" "}
                                        {item && "width" in item
                                          ? String(item.width)
                                          : "N/A"}{" "}
                                        in
                                      </span>
                                      <span>
                                        Length:{" "}
                                        {item && "length" in item
                                          ? String(item.length)
                                          : "N/A"}{" "}
                                        in
                                      </span>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="mt-2 text-xs"
                                      onClick={() => {
                                        if (item) {
                                          handleEditCard(itemId, item);
                                        }
                                      }}
                                      disabled={!item}
                                    >
                                      Edit
                                    </Button>
                                  </div>
                                </div>
                              );
                            })}
                            {swipingBatch &&
                              (() => {
                                const itemId = swipingBatch.item?.item_id || "";
                                const item = swipingBatch.item as
                                  | ItemWithDimensions
                                  | undefined;
                                const isJustSaved = justSavedItemId === itemId;
                                const isComplete =
                                  item &&
                                  item.height > 0 &&
                                  item.width > 0 &&
                                  item.length > 0;
                                return (
                                  <div
                                    key={swipingBatch.order_batch_id}
                                    className={`border rounded p-2 sm:p-3 flex flex-col min-h-0 relative transition-colors duration-300 ${
                                      isComplete
                                        ? "bg-green-50 border-green-200"
                                        : "bg-gray-50"
                                    } animate-fade-out`}
                                  >
                                    {isComplete && !isJustSaved && (
                                      <div className="absolute top-1 right-1 sm:top-2 sm:right-2">
                                        <svg
                                          className="w-4 h-4 sm:w-5 sm:h-5 text-green-600"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M7 13l3 3 7-7"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                    {isJustSaved && (
                                      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                        <svg
                                          className="w-8 h-8 sm:w-12 sm:h-12 text-green-600"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="3"
                                          viewBox="0 0 24 24"
                                        >
                                          <circle
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                          />
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M7 13l3 3 7-7"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                    <div
                                      className={`flex flex-col flex-1 min-h-0 ${isJustSaved ? "opacity-40" : ""}`}
                                    >
                                      <div
                                        className="font-semibold mb-1 text-sm sm:text-base truncate max-w-[100px] sm:max-w-[140px]"
                                        title={
                                          item?.item_number || "Unknown Item"
                                        }
                                      >
                                        {item?.item_number || "Unknown Item"}
                                      </div>
                                      <div
                                        className="text-xs text-gray-500 mb-1 truncate max-w-[120px] sm:max-w-[160px]"
                                        title={
                                          item?.description || "No description"
                                        }
                                      >
                                        {item?.description || "No description"}
                                      </div>
                                      <div className="text-xs text-gray-500 mb-1">
                                        Pallets: {swipingBatch.number_pallets}
                                      </div>
                                      <div className="text-xs text-gray-600 mt-2 flex flex-col gap-1 flex-1">
                                        <span>
                                          Height:{" "}
                                          {item && "height" in item
                                            ? String(item.height)
                                            : "N/A"}{" "}
                                          in
                                        </span>
                                        <span>
                                          Width:{" "}
                                          {item && "width" in item
                                            ? String(item.width)
                                            : "N/A"}{" "}
                                          in
                                        </span>
                                        <span>
                                          Length:{" "}
                                          {item && "length" in item
                                            ? String(item.length)
                                            : "N/A"}{" "}
                                          in
                                        </span>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        className="mt-2 text-xs"
                                        onClick={() => {
                                          if (item) {
                                            handleEditCard(itemId, item);
                                          }
                                        }}
                                        disabled={!item}
                                      >
                                        Edit
                                      </Button>
                                    </div>
                                  </div>
                                );
                              })()}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex justify-between items-center mt-4 flex-shrink-0 gap-2">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setModalPage((p) => Math.max(0, p - 1))
                          }
                          disabled={modalPage === 0}
                          className="text-xs sm:text-sm"
                        >
                          Previous
                        </Button>
                        <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                          Page {modalPage + 1} of {totalPages}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setModalPage((p) => Math.min(totalPages - 1, p + 1))
                          }
                          disabled={modalPage >= totalPages - 1}
                          className="text-xs sm:text-sm"
                        >
                          Next
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {/* Packing button logic */}
                        {(() => {
                          // Determine if this order has been packed before
                          const hasPacked = selectedOrder.status === "done";
                          // Are there any unsaved changes?

                          // Button label and disabled state
                          const packButtonLabel = hasPacked
                            ? "Re-Pack Truck"
                            : "Pack Truck";
                          const isPackButtonDisabled =
                            submitting ||
                            !allItemsComplete ||
                            itemsToSave.some(
                              (id) =>
                                !itemEdits[id]?.height ||
                                !itemEdits[id]?.width ||
                                !itemEdits[id]?.length,
                            );

                          return (
                            <Button
                              onClick={handleSubmitAll}
                              disabled={isPackButtonDisabled}
                              size="sm"
                              className="text-xs sm:text-sm"
                            >
                              {submitting ? "Packing..." : packButtonLabel}
                            </Button>
                          );
                        })()}
                        <DialogClose asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs sm:text-sm"
                          >
                            Cancel
                          </Button>
                        </DialogClose>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Item Modal */}
      {editModalOpen && editItem && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="w-full max-w-xs sm:max-w-md md:max-w-lg p-2 sm:p-6">
            <DialogHeader>
              <DialogTitle>Edit Item: {editItem.item_number}</DialogTitle>
              <DialogDescription>
                Update the dimensions for this item. Please use inches and round
                to the nearest hundredth (2 decimal places).
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <label className="w-16">Height:</label>
                <Input
                  value={editFields.height}
                  onChange={(e) =>
                    handleEditFieldChange("height", e.target.value)
                  }
                  placeholder="Height (in)"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="w-16">Width:</label>
                <Input
                  value={editFields.width}
                  onChange={(e) =>
                    handleEditFieldChange("width", e.target.value)
                  }
                  placeholder="Width (in)"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="flex gap-2 items-center">
                <label className="w-16">Length:</label>
                <Input
                  value={editFields.length}
                  onChange={(e) =>
                    handleEditFieldChange("length", e.target.value)
                  }
                  placeholder="Length (in)"
                  type="number"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button
                onClick={() => {
                  if (editItem) {
                    // If we're in an order modal context, use the order save function
                    // Otherwise, use the master sheet save function
                    if (selectedOrder && modalOpen) {
                      handleSaveEdit(editItem.item_id);
                    } else {
                      handleSaveEditFromMasterSheet(editItem.item_id);
                    }
                  }
                }}
                disabled={
                  savingItemId === editItem?.item_id ||
                  !editFields.height ||
                  !editFields.width ||
                  !editFields.length
                }
              >
                {savingItemId === editItem?.item_id ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
