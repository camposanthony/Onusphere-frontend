'use client';

import { useState } from 'react';
import { 
  Truck, 
  ArrowRight, 
  Search,
  Package
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Tool card interface for type safety
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

// List of all available tools
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

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tools based on search query
  const filteredTools = allTools.filter(tool => 
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">All Tools</h1>
      
      {/* Search and Filters */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full max-w-md"
          />
        </div>
      </div>
      
      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div 
            key={tool.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-primary/10">{tool.icon}</div>
              <div className="flex space-x-2">
                {tool.isNew && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    New
                  </Badge>
                )}
                {tool.isPopular && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                    Popular
                  </Badge>
                )}
              </div>
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
      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-bold mb-2">No tools found</h3>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Try adjusting your search or check back later for new tools.
          </p>
        </div>
      )}
    </div>
  );
}
