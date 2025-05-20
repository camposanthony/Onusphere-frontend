"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Search,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ArrowRight,
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
import {
  getCustomerById,
  getCustomerOrders,
  createTestOrder,
  Customer,
  BackendOrder,
} from "@/lib/services/load-plan-pro-api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { updateItemDimensions } from "@/lib/services/load-plan-pro-api";

export default function CustomerOrdersPage() {
  const params = useParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<BackendOrder | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [itemEdits, setItemEdits] = useState<
    Record<string, { height: string; width: string; length: string }>
  >({});
  const [itemsToSave, setItemsToSave] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [modalPage, setModalPage] = useState(0);
  const ITEMS_PER_PAGE = 9;
  const [editFields, setEditFields] = useState<{
    height: string;
    width: string;
    length: string;
  }>({ height: "", width: "", length: "" });
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<ItemWithDimensions | null>(null);

  useEffect(() => {
    fetchCustomerAndOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

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

  const handleCreateTestOrder = async () => {
    try {
      const newOrder = await createTestOrder();
      setOrders((prevOrders) => [...prevOrders, newOrder]);
      toast.success("Test order created successfully");
    } catch (error) {
      console.error("Error creating test order:", error);
      toast.error("Failed to create test order");
    }
  };

  // Open modal and set selected order
  const handleOrderCardClick = (order: BackendOrder) => {
    setSelectedOrder(order);
    setModalOpen(true);
    // Removed setExpandedItemId(null) as expandedItemId is unused
    setItemEdits({});
  };
  // Submit all edits
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
      toast.success("All item dimensions updated!");
      setModalOpen(false);
      await fetchCustomerAndOrders();
    } catch {
      toast.error("Failed to update some item dimensions");
    } finally {
      setSubmitting(false);
    }
  };

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Sort items: missing dimensions first
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

  const getSortedBatches = (order: BackendOrder) => {
    if (!order.order_batches) return [];
    // Type assertion for better type safety
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

  // Initialize edits for missing items
  useEffect(() => {
    if (selectedOrder) {
      const edits: Record<
        string,
        { height: string; width: string; length: string }
      > = {};
      const toSave: string[] = [];
      selectedOrder.order_batches.forEach((batch) => {
        // Convert to unknown first, then check for required properties
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

  // Reset page when opening modal or changing order
  useEffect(() => {
    setModalPage(0);
  }, [modalOpen, selectedOrder]);

  // Start editing a card (open item modal)
  const handleEditCard = (itemId: string, item: ItemWithDimensions) => {
    // Removed setEditingItemId as editingItemId is unused
    setEditFields({
      height: item.height !== undefined ? String(item.height) : "",
      width: item.width !== undefined ? String(item.width) : "",
      length: item.length !== undefined ? String(item.length) : "",
    });
    setEditItem(item);
    setEditModalOpen(true);
  };

  // Handle input change for edit card
  const handleEditFieldChange = (field: string, value: string) => {
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setEditFields((prev) => ({ ...prev, [field]: value }));
    }
  };

  // Save edit for a card (from item modal)
  const handleSaveEdit = async (itemId: string) => {
    setSavingItemId(itemId);
    try {
      await updateItemDimensions(itemId, {
        height: parseFloat(editFields.height),
        width: parseFloat(editFields.width),
        length: parseFloat(editFields.length),
      });
      toast.success("Item dimensions updated!");
      // Removed setEditingItemId as editingItemId is unused
      setEditModalOpen(false);
      setEditItem(null);
      await fetchCustomerAndOrders();
    } catch {
      toast.error("Failed to update item dimensions");
    } finally {
      setSavingItemId(null);
    }
  };

  // Cancel edit (from item modal)
  const handleCancelEdit = () => {
    // Removed setEditingItemId as editingItemId is unused
    setEditModalOpen(false);
    setEditItem(null);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <Button variant="ghost" onClick={() => router.back()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Customers
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
            <p className="text-gray-600 dark:text-gray-300">
              Loading customer data...
            </p>
          </div>
        ) : customer ? (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>{customer.name}</CardTitle>
                <CardDescription>{customer.email_domain}</CardDescription>
              </CardHeader>
            </Card>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="loaded">Loaded</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between items-center mb-6">
              <Button onClick={handleCreateTestOrder}>Create Test Order</Button>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300">
                  No orders found
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOrders.map((order) => (
                  <Card
                    key={order.id}
                    className="relative hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleOrderCardClick(order)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order.id.slice(0, 7).slice(0, 7)}...
                          </CardTitle>
                          <CardDescription>
                            {new Date(order.order_date).toLocaleDateString()}
                          </CardDescription>
                        </div>
                        <span
                          className={`absolute top-4 right-4 px-2 py-1 rounded text-sm z-10 ${
                            order.status === "incomplete"
                              ? "bg-yellow-100 text-yellow-800"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "done"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800" // Fallback, though ideally not reached with new types
                          }`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                          {order.order_batches?.length || 0} items
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-300">
              Customer not found
            </p>
          </div>
        )}
      </div>
      {modalOpen && selectedOrder && (
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-3xl min-h-[600px]">
            <DialogHeader>
              <DialogTitle>
                Order #{selectedOrder.id.slice(0, 7)}... Details
              </DialogTitle>
              <DialogDescription>
                {/* Only inline elements or plain text here! */}
                Order Date:{" "}
                {new Date(selectedOrder.order_date).toLocaleDateString()}
              </DialogDescription>
              {/* Move alert outside DialogDescription */}
              {selectedOrder.status === "incomplete" && (
                <div className="mb-2 p-2 bg-yellow-100 text-yellow-800 rounded flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>
                    This order is incomplete. Please update missing item
                    dimensions below.
                  </span>
                </div>
              )}
            </DialogHeader>
            {(() => {
              const sortedBatches = getSortedBatches(selectedOrder);
              const totalPages = Math.ceil(
                sortedBatches.length / ITEMS_PER_PAGE,
              );
              const pageBatches = sortedBatches.slice(
                modalPage * ITEMS_PER_PAGE,
                (modalPage + 1) * ITEMS_PER_PAGE,
              );
              const placeholders = Array.from({
                length: ITEMS_PER_PAGE - pageBatches.length,
              });
              return (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-full min-h-[420px]">
                    {pageBatches.map((batch) => {
                      const itemId = batch.item?.item_id || "";
                      const item = batch.item as ItemWithDimensions | undefined;
                      return (
                        <div
                          key={batch.order_batch_id}
                          className={`border rounded p-3 bg-gray-50`}
                        >
                          <div className="font-semibold mb-1">
                            {item?.item_number || "Unknown Item"}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            {item?.description}
                          </div>
                          <div className="text-xs text-gray-500 mb-1">
                            Pallets: {batch.number_pallets}
                          </div>
                          <div className="text-xs text-gray-600 mt-2">
                            Height:{" "}
                            {item && "height" in item
                              ? String(item.height)
                              : "N/A"}{" "}
                            in, Width:{" "}
                            {item && "width" in item
                              ? String(item.width)
                              : "N/A"}{" "}
                            in, Length:{" "}
                            {item && "length" in item
                              ? String(item.length)
                              : "N/A"}{" "}
                            in
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="mt-2"
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
                      );
                    })}
                    {placeholders.map((_, idx) => (
                      <div
                        key={`placeholder-${idx}`}
                        className="border rounded p-3 bg-transparent h-full min-h-[120px]"
                      />
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setModalPage((p) => Math.max(0, p - 1))}
                        disabled={modalPage === 0}
                      >
                        Previous
                      </Button>
                      <span className="mx-2 text-sm text-gray-500">
                        Page {modalPage + 1} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setModalPage((p) => Math.min(totalPages - 1, p + 1))
                        }
                        disabled={modalPage >= totalPages - 1}
                      >
                        Next
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleSubmitAll}
                        disabled={
                          submitting ||
                          itemsToSave.some(
                            (id) =>
                              !itemEdits[id]?.height ||
                              !itemEdits[id]?.width ||
                              !itemEdits[id]?.length,
                          )
                        }
                      >
                        {submitting ? "Submitting..." : "Submit All"}
                      </Button>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
      )}
      {editModalOpen && editItem && (
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent className="max-w-md">
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
                onClick={() => handleSaveEdit(editItem.item_id)}
                disabled={
                  savingItemId === editItem.item_id ||
                  !editFields.height ||
                  !editFields.width ||
                  !editFields.length
                }
              >
                {savingItemId === editItem.item_id ? "Saving..." : "Save"}
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
