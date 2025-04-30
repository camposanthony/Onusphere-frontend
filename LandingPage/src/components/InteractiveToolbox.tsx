import React, { useState } from 'react';
import { Truck, MessageSquare, ClipboardList, Globe, BarChart, Server, X } from 'lucide-react';

interface Tool {
  id: string;
  icon: React.ReactNode;
  name: string;
  description: string;
  available: boolean;
  position: { x: number; y: number };
}

const InteractiveToolbox: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);
  
  const tools: Tool[] = [
    {
      id: 'truck-loading',
      icon: <Truck className="h-6 w-6" />,
      name: 'Truck Loading Optimizer',
      description: 'AI-powered solution that creates optimal loading plans to maximize cargo space utilization.',
      available: true,
      position: { x: 30, y: 40 }
    },
    {
      id: 'communication',
      icon: <MessageSquare className="h-6 w-6" />,
      name: 'Communication Automation Hub',
      description: 'Automate and streamline all logistics-related communications with customers, drivers, and internal stakeholders.',
      available: true,
      position: { x: 70, y: 60 }
    },
    {
      id: 'route-planning',
      icon: <ClipboardList className="h-6 w-6" />,
      name: 'Route Planning System',
      description: 'Calculate optimal delivery routes based on multiple factors including traffic, vehicle constraints, and delivery windows.',
      available: false,
      position: { x: 20, y: 70 }
    },
    {
      id: 'supply-chain',
      icon: <Globe className="h-6 w-6" />,
      name: 'Supply Chain Visibility',
      description: 'Real-time tracking and monitoring of your entire supply chain with customizable dashboards and alerts.',
      available: false,
      position: { x: 60, y: 30 }
    },
    {
      id: 'analytics',
      icon: <BarChart className="h-6 w-6" />,
      name: 'Logistics Analytics',
      description: 'Comprehensive data analysis and reporting to identify optimization opportunities across your operations.',
      available: false,
      position: { x: 40, y: 20 }
    },
    {
      id: 'warehouse',
      icon: <Server className="h-6 w-6" />,
      name: 'Warehouse Management',
      description: 'Optimize inventory placement, picking routes, and warehouse operations for maximum efficiency.',
      available: false,
      position: { x: 80, y: 40 }
    }
  ];

  // Draw connection lines between the two available tools
  const connections = [
    { from: 'truck-loading', to: 'communication' }
  ];

  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      <div className="section-title">
        <h2 className="text-dark-text dark:text-white">Explore Our Toolbox</h2>
        <p className="text-secondary-text dark:text-light-gray">Click on any tool to learn more about its capabilities and how it integrates with other tools.</p>
      </div>
      
      {/* Interactive Visualization */}
      <div className="max-w-5xl mx-auto mt-12 relative">
        <div className="aspect-[16/9] bg-light-card dark:bg-slate-gray rounded-lg border border-light-border dark:border-medium-gray p-6 relative">
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            {connections.map((connection, index) => {
              const fromTool = tools.find(t => t.id === connection.from);
              const toTool = tools.find(t => t.id === connection.to);
              
              if (!fromTool || !toTool) return null;
              
              return (
                <g key={index}>
                  <line 
                    x1={`${fromTool.position.x}%`} 
                    y1={`${fromTool.position.y}%`} 
                    x2={`${toTool.position.x}%`} 
                    y2={`${toTool.position.y}%`} 
                    stroke="#9ca3af" 
                    strokeWidth="2"
                    strokeDasharray="4"
                    className="dark:stroke-[#505055]"
                  />
                  <line 
                    x1={`${fromTool.position.x}%`} 
                    y1={`${fromTool.position.y}%`} 
                    x2={`${toTool.position.x}%`} 
                    y2={`${toTool.position.y}%`} 
                    stroke="#60a5fa" 
                    strokeWidth="2"
                    strokeDasharray="4"
                    className="animate-pulse dark:stroke-[#00B2FF]"
                    style={{ opacity: 0.5 }}
                  />
                </g>
              );
            })}
          </svg>
          
          {/* Tools */}
          {tools.map((tool) => (
            <button
              key={tool.id}
              className={`absolute p-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                tool.available 
                  ? 'bg-accent-green text-white hover:shadow-lg hover:shadow-accent-green/20' 
                  : 'bg-secondary-text/50 dark:bg-medium-gray text-white opacity-50'
              }`}
              style={{ 
                left: `${tool.position.x}%`, 
                top: `${tool.position.y}%`,
              }}
              onClick={() => setSelectedTool(tool)}
              disabled={!tool.available}
            >
              {tool.icon}
              <span className={`absolute -top-2 -right-2 w-3 h-3 rounded-full ${
                tool.available ? 'bg-green-500' : 'bg-medium-gray'
              }`}></span>
            </button>
          ))}
          
          {/* Central Toolbox */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="h-20 w-20 bg-white dark:bg-charcoal rounded-lg border border-accent-green flex items-center justify-center shadow-lg shadow-accent-green/20">
              <div className="text-accent-green">
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
        
        {/* Selection Info */}
        {selectedTool && (
          <div className="absolute -bottom-36 md:bottom-8 md:right-8 w-full md:w-72 bg-white dark:bg-charcoal border border-accent-green rounded-lg p-4 shadow-lg shadow-accent-green/20 animate-fade-in">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium text-dark-text dark:text-white">{selectedTool.name}</h3>
              <button 
                className="text-secondary-text dark:text-medium-gray hover:text-dark-text dark:hover:text-white"
                onClick={() => setSelectedTool(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-secondary-text dark:text-light-gray">{selectedTool.description}</p>
            <div className="mt-3">
              <a href="#get-started" className="text-accent-green text-sm hover:underline">
                Learn more about this tool
              </a>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-center mt-48 md:mt-24">
        <p className="italic text-secondary-text dark:text-medium-gray">All tools in the Onusphere ecosystem are designed to work together seamlessly.</p>
      </div>
    </section>
  );
};

export default InteractiveToolbox;