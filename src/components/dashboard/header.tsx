"use client";

import { useState } from "react";
import { Bell, Search, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(3);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [notificationItems, setNotificationItems] = useState([
    {
      id: 1,
      title: "New shipment request",
      description: "ABC Logistics added a new delivery request",
      time: "2 hours ago",
    },
    {
      id: 2,
      title: "Route optimization complete",
      description: "Your routes have been optimized for today",
      time: "5 hours ago",
    },
    {
      id: 3,
      title: "System update",
      description: "Platform updated to version 2.5.0",
      time: "Yesterday",
    },
    {
      id: 4,
      title: "Maintenance notification",
      description: "Scheduled maintenance on Saturday",
      time: "2 days ago",
    },
    {
      id: 5,
      title: "Account update",
      description: "Your profile information was updated",
      time: "3 days ago",
    },
  ]);

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Left section - Search */}
      <div className="hidden md:flex md:w-1/3 lg:w-1/4">
        <div className="w-full relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input type="text" placeholder="Search..." className="w-full pl-8" />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center ml-auto space-x-4">
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {notificationCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <div className="flex items-center justify-between px-2">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              {notificationItems.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setClearAllDialogOpen(true)}
                  className="text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Clear all
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto overflow-x-hidden">
              {notificationItems.length > 0 ? (
                notificationItems.slice(0, 3).map((notification) => (
                  <div key={notification.id}>
                    <div className="group cursor-pointer flex items-start p-3">
                      <div className="flex flex-col space-y-1 w-full">
                        <span className="font-medium break-words">
                          {notification.title}
                        </span>
                        <span className="text-sm text-gray-500 break-words">
                          {notification.description}
                        </span>
                        <span className="text-xs text-gray-400">
                          {notification.time}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newItems = notificationItems.filter(
                            (item) => item.id !== notification.id,
                          );
                          setNotificationItems(newItems);
                          setNotificationCount(newItems.length);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <DropdownMenuSeparator />
                  </div>
                ))
              ) : (
                <div className="p-3 text-center text-gray-500 text-sm">
                  No notifications
                </div>
              )}
            </div>
            {notificationItems.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => setShowAllNotifications(true)}
                >
                  <span className="text-primary mx-auto">
                    View all notifications
                  </span>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Clear All Confirmation Dialog */}
      <AlertDialog
        open={clearAllDialogOpen}
        onOpenChange={setClearAllDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all notifications?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all notifications. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setNotificationItems([]);
                setNotificationCount(0);
                setClearAllDialogOpen(false);
              }}
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* All Notifications Dialog */}
      <Dialog
        open={showAllNotifications}
        onOpenChange={setShowAllNotifications}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex flex-row items-center justify-between w-full pr-6">
              <div>
                <DialogTitle>All Notifications</DialogTitle>
                <DialogDescription>
                  Your recent activity and system notifications
                </DialogDescription>
              </div>
              {notificationItems.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setClearAllDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Clear all</span>
                </Button>
              )}
            </div>
          </DialogHeader>
          <div className="max-h-[70vh] overflow-y-auto space-y-4 mt-4">
            {notificationItems.length > 0 ? (
              notificationItems.map((notification) => (
                <div
                  key={notification.id}
                  className="border rounded-md p-4 group relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => {
                      const newItems = notificationItems.filter(
                        (item) => item.id !== notification.id,
                      );
                      setNotificationItems(newItems);
                      setNotificationCount(newItems.length);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-col space-y-1">
                    <span className="font-medium break-words">
                      {notification.title}
                    </span>
                    <span className="text-sm text-gray-500 break-words">
                      {notification.description}
                    </span>
                    <span className="text-xs text-gray-400">
                      {notification.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <p>No notifications</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
