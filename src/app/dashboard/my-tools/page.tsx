'use client';

import { useState, useEffect } from 'react';
import {
  Truck,
  ArrowRight,
  Search,
  Star,
  PlusCircle,
  Package
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
    icon: <Truck className="h-10 w-10 text-primary" />,
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
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold">My Tools</h1>
        <Button onClick={handleAddTool} variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Tool
        </Button>
      </div>
      
      {/* Search */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search your tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full max-w-md"
          />
        </div>
      </div>
      
      {/* My Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {myTools.map((tool) => (
          <div 
            key={tool.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-primary/10">{tool.icon}</div>
              <Button variant="ghost" size="icon" className="text-yellow-400 hover:text-yellow-500" title="Favorited">
                <Star className="h-5 w-5 fill-current" />
              </Button>
            </div>
            
            <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{tool.description}</p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {tool.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <Link href={tool.path}>
              <Button className="w-full">
                Launch Tool
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        ))}
      </div>
      
      {/* Empty State */}
      {myTools.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No saved tools</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-md mx-auto">
            Add tools to your personalized dashboard for quick access to the ones you use most frequently.
          </p>
          <Button onClick={handleAddTool}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Your First Tool
          </Button>
        </div>
      )}
    </div>
  );
}
