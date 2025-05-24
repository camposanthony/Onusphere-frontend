'use client';

import { useState, useEffect } from 'react';
import {
  Truck,
  ArrowRight,
  Search,
  Star,
  PlusCircle,
  Package,
  Heart
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Tool interface - shared with all-tools page
interface ToolCard {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  tags: string[];
  isPopular?: boolean;
  isNew?: boolean;
}

// All available tools (same as in the all-tools page)
const allTools: ToolCard[] = [
  {
    id: 'load-plan-pro',
    name: 'Load Plan Pro',
    description: 'Manage customers, orders, and optimize truck loading for your delivery operations',
    icon: <Truck className="h-6 w-6 text-white" />,
    path: '/dashboard/tools/load-plan-pro',
    tags: ['logistics', 'delivery', 'optimization'],
    isPopular: true
  },
  // In the future, more tools will be added here
];

export default function MyToolsPage() {
  // State for search and saved tools
  const [searchQuery, setSearchQuery] = useState('');
  const [savedTools, setSavedTools] = useState<string[]>([]);
  
  // Simulate loading saved tools from local storage or an API
  useEffect(() => {
    // In a real app, you would fetch this from your backend
    // For demo purposes, we'll just use the Load Plan Pro as a default saved tool
    setSavedTools(['load-plan-pro']);
  }, []);

  // Filter tools based on search query and whether they're saved
  const myTools = allTools
    .filter(tool => savedTools.includes(tool.id))
    .filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  // Function to simulate adding a tool to saved tools
  const handleAddTool = () => {
    // In a real app, this would navigate to a selection screen or modal
    // For now, we'll just show that functionality would exist here
    alert('In a production app, this would open a dialog to add more tools to your My Tools section.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    My Tools
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Your personalized collection of favorite tools
                  </p>
                </div>
              </div>
              
              {/* Stats Section */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {savedTools.length} Saved Tools
                    </span>
                  </div>
                </div>
                {myTools.length > 0 && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl px-4 py-3 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-purple-500 fill-current" />
                      <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                        Quick Access Ready
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button 
              onClick={handleAddTool} 
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 h-11 px-6"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Tool
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search your tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg"
            />
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {myTools.length} of {savedTools.length} saved tools
            </div>
          )}
        </div>
        
        {/* My Tools Grid */}
        {myTools.length === 0 && savedTools.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No saved tools</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
              Add tools to your personalized dashboard for quick access to the ones you use most frequently.
            </p>
            <Button 
              onClick={handleAddTool}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Tool
            </Button>
          </div>
        ) : myTools.length === 0 && searchQuery ? (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Search className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4">
              Try adjusting your search terms
            </p>
            <Button 
              onClick={() => setSearchQuery('')}
              className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myTools.map((tool) => (
              <div 
                key={tool.id}
                className="group border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-all duration-200 bg-white dark:bg-slate-800 overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    {tool.icon}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-amber-400 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20" 
                    title="Favorited"
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </Button>
                </div>
                
                <h3 className="text-xl font-bold mb-2 text-slate-900 dark:text-white">{tool.name}</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">{tool.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {tool.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
                
                <Link href={tool.path}>
                  <Button className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 transition-all duration-200">
                    Launch Tool
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
