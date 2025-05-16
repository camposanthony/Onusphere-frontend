'use client';

import { useState } from 'react';
import { 
  Check, 
  Truck, 
  Package, 
  ArrowRight, 
  CheckCircle2, 
  Loader2 
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
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

type OrderStatus = 'pending' | 'loaded' | 'delivered';

interface OrderStatusUpdaterProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusUpdate: (orderId: string, newStatus: OrderStatus, notes?: string) => void;
}

export default function OrderStatusUpdater({ 
  orderId, 
  currentStatus, 
  onStatusUpdate 
}: OrderStatusUpdaterProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState('');

  const getNextStatus = (current: OrderStatus): OrderStatus => {
    if (current === 'pending') return 'loaded';
    if (current === 'loaded') return 'delivered';
    return current; // Already delivered, no next status
  };

  const nextStatus = getNextStatus(currentStatus);
  const isDelivered = currentStatus === 'delivered';

  const getStatusText = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return 'Pending';
      case 'loaded': return 'Loaded';
      case 'delivered': return 'Delivered';
    }
  };

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending': return <Package className="h-4 w-4" />;
      case 'loaded': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Pending</Badge>;
      case 'loaded':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Loaded</Badge>;
      case 'delivered':
        return <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Delivered</Badge>;
    }
  };

  const handleUpdateStatus = () => {
    setIsUpdating(true);
    
    // Simulate API call
    setTimeout(() => {
      onStatusUpdate(orderId, nextStatus, notes);
      setIsUpdating(false);
      setOpen(false);
      setNotes('');
    }, 800);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1"
          disabled={isDelivered}
        >
          {getStatusBadge(currentStatus)}
          {!isDelivered && (
            <>
              <ArrowRight className="h-3 w-3 mx-1" />
              {getStatusIcon(nextStatus)}
            </>
          )}
        </Button>
      </DialogTrigger>
      
      {!isDelivered && (
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Change order #{orderId} status from {getStatusText(currentStatus)} to {getStatusText(nextStatus)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center my-4 text-sm">
            <div className="flex items-center justify-center bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 px-3 py-2 rounded-l-md">
              {getStatusIcon(currentStatus)}
              <span className="ml-2">{getStatusText(currentStatus)}</span>
            </div>
            <div className="px-2">
              <ArrowRight className="h-4 w-4 text-gray-500" />
            </div>
            <div className="flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-3 py-2 rounded-r-md">
              {getStatusIcon(nextStatus)}
              <span className="ml-2">{getStatusText(nextStatus)}</span>
            </div>
          </div>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes about this status change..."
                value={notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="submit"
              onClick={handleUpdateStatus}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Update Status
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
