'use client';

import { useState } from 'react';
import { Bell, Moon, Sun, Search, LogOut, User, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/components/theme-provider';
import { useAuth } from '@/lib/context/AuthContext';
import { useUser } from '@/lib/hooks/useUser';
import { Input } from '@/components/ui/input';

export default function Header() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(3);
  const { logout } = useAuth();
  const { user, loading } = useUser();

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      {/* Left section - Search */}
      <div className="hidden md:flex md:w-1/3 lg:w-1/4">
        <div className="w-full relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="text"
            placeholder="Search..."
            className="w-full pl-8"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center ml-auto space-x-4">

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  {notifications}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">New shipment request</span>
                  <span className="text-sm text-gray-500">ABC Logistics added a new delivery request</span>
                  <span className="text-xs text-gray-400">2 hours ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">Route optimization complete</span>
                  <span className="text-sm text-gray-500">Your routes have been optimized for today</span>
                  <span className="text-xs text-gray-400">5 hours ago</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <div className="flex flex-col space-y-1">
                  <span className="font-medium">System update</span>
                  <span className="text-sm text-gray-500">Platform updated to version 2.5.0</span>
                  <span className="text-xs text-gray-400">Yesterday</span>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <span className="text-primary mx-auto">View all notifications</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}