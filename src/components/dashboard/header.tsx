"use client";

import { useState, useEffect } from "react";
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
import {
  getNotifications,
  getUnreadCount,
  markNotificationsRead,
  deleteNotification,
  clearAllNotifications,
  formatNotificationTime,
  getNotificationIcon,
  type Notification,
} from "@/lib/services/notifications";

export default function Header() {
  const [notificationCount, setNotificationCount] = useState(0);
  const [showAllNotifications, setShowAllNotifications] = useState(false);
  const [clearAllDialogOpen, setClearAllDialogOpen] = useState(false);
  const [notificationItems, setNotificationItems] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load notifications and count on component mount
  useEffect(() => {
    loadNotifications();
    loadUnreadCount();
    
    // Set up polling for real-time updates
    const interval = setInterval(() => {
      loadUnreadCount();
    }, 30000); // Check for new notifications every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const notifications = await getNotifications(50, 0, false);
      setNotificationItems(notifications);
      setError(null);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const countData = await getUnreadCount();
      setNotificationCount(countData.unread_count);
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      
      // Update local state
      const updatedItems = notificationItems.filter(item => item.id !== notificationId);
      setNotificationItems(updatedItems);
      
      // Update count if the deleted notification was unread
      const deletedNotification = notificationItems.find(item => item.id === notificationId);
      if (deletedNotification && !deletedNotification.is_read) {
        setNotificationCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  };

  const handleClearAllNotifications = async () => {
    try {
      await clearAllNotifications();
      setNotificationItems([]);
      setNotificationCount(0);
      setClearAllDialogOpen(false);
    } catch (err) {
      console.error('Error clearing notifications:', err);
      setError(err instanceof Error ? err.message : 'Failed to clear notifications');
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationsRead([notificationId]);
      
      // Update local state
      setNotificationItems(prev => 
        prev.map(item => 
          item.id === notificationId 
            ? { ...item, is_read: true, read_at: new Date().toISOString() }
            : item
        )
      );
      
      // Update count
      const notification = notificationItems.find(item => item.id === notificationId);
      if (notification && !notification.is_read) {
        setNotificationCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id);
    }
  };

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
                  {notificationCount > 99 ? '99+' : notificationCount}
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
              {loading ? (
                <div className="p-3 text-center text-gray-500 text-sm">
                  Loading notifications...
                </div>
              ) : error ? (
                <div className="p-3 text-center text-red-500 text-sm">
                  {error}
                </div>
              ) : notificationItems.length > 0 ? (
                notificationItems.slice(0, 5).map((notification) => (
                  <div key={notification.id}>
                    <div 
                      className={`group cursor-pointer flex items-start p-3 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 ${
                        !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start gap-2 w-full">
                        <span className="text-lg mt-0.5">{getNotificationIcon(notification.type)}</span>
                        <div className="flex flex-col space-y-1 flex-1 min-w-0">
                          <span className={`font-medium break-words ${
                            !notification.is_read ? 'text-blue-900 dark:text-blue-100' : ''
                          }`}>
                            {notification.title}
                          </span>
                          <span className="text-sm text-gray-500 break-words">
                            {notification.description}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatNotificationTime(notification.created_at)}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
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
            {notificationItems.length > 5 && (
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
              This will permanently remove all notifications. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearAllNotifications}>
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
                  className={`border rounded-md p-4 group relative transition-colors cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                    !notification.is_read ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex items-start gap-2">
                    <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                    <div className="flex flex-col space-y-1 flex-1">
                      <span className={`font-medium break-words ${
                        !notification.is_read ? 'text-blue-900 dark:text-blue-100' : ''
                      }`}>
                        {notification.title}
                      </span>
                      <span className="text-sm text-gray-500 break-words">
                        {notification.description}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatNotificationTime(notification.created_at)}
                      </span>
                    </div>
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
