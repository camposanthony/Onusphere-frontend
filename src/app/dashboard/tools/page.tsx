'use client';

import { useState } from 'react';
import { 
  Truck, 
  ArrowRight, 
  Search,
  Package,
  Sparkles
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
    icon: <Truck className="h-6 w-6 text-white" />,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent">
                    All Tools
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 text-lg">
                    Discover and launch powerful business tools
                  </p>
                </div>
              </div>
              
              {/* Stats Section */}
              <div className="flex flex-wrap gap-4 mt-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {allTools.length} Total Tools
                    </span>
                  </div>
                </div>
                {allTools.filter(t => t.isPopular).length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-4 py-3 border border-amber-200 dark:border-amber-800">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3 text-amber-500" />
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        {allTools.filter(t => t.isPopular).length} Popular
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
            <Input
              placeholder="Search tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-11 bg-slate-50 dark:bg-slate-700 border-slate-300 dark:border-slate-600 rounded-lg"
            />
          </div>
          {searchQuery && (
            <div className="mt-3 text-sm text-slate-600 dark:text-slate-400">
              {filteredTools.length} of {allTools.length} tools
            </div>
          )}
        </div>
        
        {/* Tools Grid */}
        {filteredTools.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <Package className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
              No tools found
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto">
              Try adjusting your search or check back later for new tools.
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
            {filteredTools.map((tool) => (
              <div 
                key={tool.id}
                className="group border border-slate-200 dark:border-slate-700 rounded-xl p-6 transition-all duration-200 bg-white dark:bg-slate-800 overflow-hidden"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                    {tool.icon}
                  </div>
                  <div className="flex space-x-2">
                    {tool.isNew && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                        New
                      </Badge>
                    )}
                    {tool.isPopular && (
                      <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-0">
                        Popular
                      </Badge>
                    )}
                  </div>
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
