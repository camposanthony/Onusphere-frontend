'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Wrench,
  Briefcase,
  Users, 
  Settings, 
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';

// Updated routes based on user requirements
const routes = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    href: '/dashboard',
    active: (path: string) => path === '/dashboard',
  },
  {
    label: 'My Tools',
    icon: Wrench,
    href: '/dashboard/my-tools',
    active: (path: string) => path.startsWith('/dashboard/my-tools'),
  },
  {
    label: 'All Tools',
    icon: Briefcase,
    href: '/dashboard/tools',
    active: (path: string) => path.startsWith('/dashboard/tools') && !path.startsWith('/dashboard/my-tools'),
  },
  {
    label: 'Users',
    icon: Users,
    href: '/dashboard/users',
    active: (path: string) => path.startsWith('/dashboard/users'),
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/dashboard/settings',
    active: (path: string) => path.startsWith('/dashboard/settings'),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();
  
  // Try to restore collapsed state from localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState !== null) {
      setCollapsed(savedState === 'true');
    }
  }, []);

  // Save collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', collapsed.toString());
  }, [collapsed]);

  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Mobile Sidebar Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      {/* Collapse toggle button for desktop */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden md:flex fixed bottom-4 left-4 z-50 shadow-md rounded-full bg-white dark:bg-gray-800"
        onClick={toggleSidebar}
      >
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>

      {/* Sidebar for both mobile and desktop */}
      <div 
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          collapsed ? "md:w-20" : "md:w-64",
          "w-64" // Default width for mobile
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <Link href="/" className="flex items-center space-x-2 overflow-hidden">
            <Menu className="h-6 w-6 text-primary flex-shrink-0" />
            <span className={cn("font-bold text-xl transition-opacity duration-200", 
              collapsed ? "opacity-0" : "opacity-100"
            )}>LogiHub</span>
          </Link>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <div className="space-y-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  collapsed ? "justify-center" : "space-x-3",
                  route.active(pathname)
                    ? "bg-primary/10 text-primary dark:bg-primary/20"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                )}
                title={collapsed ? route.label : undefined}
              >
                <route.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{route.label}</span>}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div 
            className={cn(
              "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
              collapsed ? "justify-center" : "space-x-3",
              "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            )}
            title={collapsed ? "Sign Out" : undefined}
            onClick={logout}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </div>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      
      {/* Empty div to push content over on desktop */}
      <div className={cn(
        "hidden md:block md:flex-shrink-0 transition-all duration-300",
        collapsed ? "md:w-20" : "md:w-64"
      )}></div>
    </>
  );
}