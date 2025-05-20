"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

export interface Customer {
  id: string;
  name: string | null;
  email_domain: string;
  incompleteOrderCount?: number;
}

interface CustomerCardProps {
  customer: Customer;
  isLoading?: boolean;
  onNameUpdate?: (id: string, newName: string) => void;
}

export default function CustomerCard({
  customer,
  isLoading,
  onNameUpdate,
}: CustomerCardProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(customer.name || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleEdit = () => {
    if (!isLoading && !saving) setEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleBlurOrEnter = async () => {
    if (name.trim() && name !== customer.name) {
      setSaving(true);
      setError(null);
      try {
        const res = await fetch(`/api/customers/${customer.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error("Failed to update name");
        if (onNameUpdate) onNameUpdate(customer.id, name);
      } catch {
        setError("Could not update name.");
      }
      setSaving(false);
    }
    setEditing(false);
  };

  return (
    <Card className="relative flex flex-col h-full px-4 py-3">
      {/* Notification badge for incomplete orders */}
      {customer.incompleteOrderCount && customer.incompleteOrderCount > 0 && (
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-yellow-100 text-yellow-800 rounded-full px-3 py-1 shadow z-10 border border-yellow-300 font-medium text-xs">
          <svg
            className="w-4 h-4 mr-1 text-yellow-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {customer.incompleteOrderCount} Incomplete Order
          {customer.incompleteOrderCount > 1 ? "s" : ""}
        </div>
      )}
      <CardHeader className="flex-1 flex flex-col justify-center p-0 mb-2">
        <CardTitle className="flex items-center text-lg font-bold leading-tight min-h-[2.5rem]">
          {editing ? (
            <Input
              value={name}
              onChange={handleChange}
              onBlur={handleBlurOrEnter}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleBlurOrEnter();
                if (e.key === "Escape") {
                  setEditing(false);
                  setName(customer.name || "");
                }
              }}
              disabled={saving}
              autoFocus
              className="w-full h-10 text-lg font-bold px-2 py-1"
              placeholder="Enter customer name"
              maxLength={40}
            />
          ) : (
            <span
              className={`cursor-pointer flex items-center gap-1 truncate w-full ${!customer.name ? "text-gray-400 italic" : ""}`}
              onClick={handleEdit}
              title="Click to edit name"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") handleEdit();
              }}
              role="button"
              aria-label="Edit customer name"
              style={{ minHeight: 40 }}
            >
              <span className="truncate">{customer.name || "Add a Name"}</span>
              <Pencil className="inline h-4 w-4 ml-1 text-gray-400" />
            </span>
          )}
        </CardTitle>
        <CardDescription className="truncate text-xs text-muted-foreground mt-1">{customer.email_domain}</CardDescription>
        {error && <div className="text-xs text-red-500 mt-1">{error}</div>}
      </CardHeader>
      <CardFooter className="mt-auto p-0 pt-2">
        <Button
          variant="outline"
          className="w-full h-9 text-base font-medium"
          onClick={() => router.push(`/dashboard/tools/load-plan-pro/customer/${customer.id}/orders`)}
          disabled={isLoading || saving}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
          View Orders
        </Button>
      </CardFooter>
    </Card>
  );
}
