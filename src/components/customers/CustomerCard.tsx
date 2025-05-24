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
import { Badge } from "@/components/ui/badge";
import { Loader2, Pencil, User, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { authPut } from "@/lib/utils/api";

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
        await authPut(`/customer/${customer.id}`, { name });
        if (onNameUpdate) onNameUpdate(customer.id, name);
      } catch (err) {
        setError("Could not update name.");
        console.error("Failed to update customer name:", err);
      }
      setSaving(false);
    }
    setEditing(false);
  };

  return (
    <div className="group border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-all duration-200 bg-white dark:bg-slate-800 overflow-hidden relative flex flex-col h-full">
      {/* Notification badge for incomplete orders */}
      {customer.incompleteOrderCount && customer.incompleteOrderCount > 0 && (
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            {customer.incompleteOrderCount} Incomplete
          </Badge>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
          <User className="h-6 w-6 text-white" />
        </div>
      </div>

      <div className="flex-1 mb-4">
        <div className="mb-2">
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
            <h3 
              className={`text-xl font-bold mb-2 text-slate-900 dark:text-white cursor-pointer flex items-center gap-2 ${!customer.name ? "text-slate-400 italic" : ""}`}
              onClick={handleEdit}
              title="Click to edit name"
            >
              <span className="truncate flex-1">{customer.name || "Add a Name"}</span>
              <Pencil className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </h3>
          )}
        </div>
        
        <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed text-sm">
          {customer.email_domain}
        </p>

        {error && (
          <div className="text-xs text-red-500 mb-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}
      </div>

      <Button
        className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200"
        onClick={() => router.push(`/dashboard/tools/load-plan-pro/customer/${customer.id}`)}
        disabled={isLoading || saving}
      >
        {saving ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : null}
        View Orders
        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
}
