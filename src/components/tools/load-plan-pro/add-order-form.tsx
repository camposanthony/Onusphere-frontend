"use client";

import { useState } from "react";
import { Plus, Trash2, Loader2, PackagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type OrderStatus = "pending";
type Priority = "low" | "medium" | "high";

interface Order {
  id: string;
  customer: string;
  customerId: string;
  products: string[];
  status: OrderStatus;
  date: string;
  priority: Priority;
  notes: string;
}

interface AddOrderFormProps {
  customerId: string;
  customerName: string;
  onOrderAdded: (newOrder: Order) => void;
}

export default function AddOrderForm({
  customerId,
  customerName,
  onOrderAdded,
}: AddOrderFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<
    { name: string; quantity: string }[]
  >([{ name: "", quantity: "" }]);
  const [priority, setPriority] = useState<Priority>("medium");
  const [notes, setNotes] = useState("");

  const handleAddProduct = () => {
    setProducts([...products, { name: "", quantity: "" }]);
  };

  const handleRemoveProduct = (index: number) => {
    if (products.length === 1) return;
    const newProducts = [...products];
    newProducts.splice(index, 1);
    setProducts(newProducts);
  };

  const handleProductChange = (
    index: number,
    field: "name" | "quantity",
    value: string,
  ) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Format products for the order
      const formattedProducts = products
        .filter((p) => p.name.trim() !== "")
        .map((p) => `${p.name} (${p.quantity})`);

      const newOrder: Order = {
        id: `o${Math.floor(Math.random() * 10000)}`,
        customer: customerName,
        customerId: customerId,
        products: formattedProducts,
        status: "pending",
        date: new Date().toISOString().slice(0, 10),
        priority,
        notes,
      };

      onOrderAdded(newOrder);
      setIsSubmitting(false);
      setOpen(false);

      // Reset form
      setProducts([{ name: "", quantity: "" }]);
      setPriority("medium");
      setNotes("");
    }, 1000);
  };

  const isFormValid = () => {
    return products.some(
      (p) => p.name.trim() !== "" && p.quantity.trim() !== "",
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Add New Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Add New Order</DialogTitle>
          <DialogDescription>
            Create a new order for {customerName}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="font-medium">Products</Label>
            {products.map((product, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1">
                  <Input
                    placeholder="Product name"
                    value={product.name}
                    onChange={(e) =>
                      handleProductChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="w-24">
                  <Input
                    placeholder="Qty"
                    value={product.quantity}
                    onChange={(e) =>
                      handleProductChange(index, "quantity", e.target.value)
                    }
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveProduct(index)}
                  disabled={products.length === 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleAddProduct}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={priority}
              onValueChange={(val: Priority) => setPriority(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Order Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any notes about this order..."
              value={notes}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setNotes(e.target.value)
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <PackagePlus className="mr-2 h-4 w-4" />
                Create Order
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
