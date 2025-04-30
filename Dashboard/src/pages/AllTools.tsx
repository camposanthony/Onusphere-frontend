import { Search, Filter, Wrench, Tag, ArrowDownUp } from 'lucide-react';
import { useState } from 'react';

const AllTools = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const categories = ['All', 'Planning', 'Tracking', 'Communication', 'Analytics', 'Optimization'];
  
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient">All Tools</h1>
        <p style={{color: 'var(--muted-foreground)'}} className="mt-1">
          Discover and add logistics tools to your workspace
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative flex-1 max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} style={{color: 'var(--muted-foreground)'}} />
          </div>
          <input
            type="text"
            placeholder="Search for tools..."
            className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-1 focus:ring-accent"
            style={{backgroundColor: 'var(--muted)', borderColor: 'var(--border)'}}
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="py-2 px-4 rounded-md transition-colors flex items-center border" 
                  style={{backgroundColor: 'var(--muted)', color: 'var(--foreground)', borderColor: 'var(--border)'}}>

            <Filter size={18} className="mr-2" />
            Filters
          </button>
          <button className="py-2 px-4 rounded-md transition-colors flex items-center border" 
                  style={{backgroundColor: 'var(--muted)', color: 'var(--foreground)', borderColor: 'var(--border)'}}>

            <ArrowDownUp size={18} className="mr-2" />
            Sort
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="overflow-x-auto pb-2">
        <div className="flex space-x-2 min-w-max">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-accent text-white'
                  : 'border'
              }`}
              style={activeCategory !== category ? {backgroundColor: 'var(--muted)', color: 'var(--foreground)', borderColor: 'var(--border)'} : {}}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Tool Card 1 */}
        <div className="dashboard-card rounded-lg hover:border-accent transition-colors overflow-hidden group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-md bg-accent/10">
                <Wrench size={24} className="text-accent" />
              </div>
              <div className="text-xs py-1 px-2 rounded-full" style={{backgroundColor: 'var(--accent-background)', color: 'var(--accent)'}}>
                Popular
              </div>
            </div>
            <h3 className="font-medium text-lg mb-2">Route Optimization</h3>
            <p className="text-sm mb-4" style={{color: 'var(--muted-foreground)'}}>
              AI-powered route optimization for multiple vehicles with constraints and real-time traffic data.
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Tag size={14} style={{color: 'var(--muted-foreground)'}} />
                <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>Planning</span>
              </div>
              <button className="py-1 px-3 rounded-md border hover:opacity-80 transition-colors flex-shrink-0"
                      style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--accent)'}}>

                Add
              </button>
            </div>
          </div>
        </div>

        {/* Tool Card 2 */}
        <div className="dashboard-card rounded-lg hover:border-accent transition-colors overflow-hidden group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-md bg-accent/10">
                <Wrench size={24} className="text-accent" />
              </div>
              <div className="text-xs py-1 px-2 rounded-full" style={{backgroundColor: 'var(--accent-background)', color: 'var(--accent)'}}>
                New
              </div>
            </div>
            <h3 className="font-medium text-lg mb-2">Load Balancer</h3>
            <p className="text-sm mb-4" style={{color: 'var(--muted-foreground)'}}>
              Optimize weight distribution across your fleet to maximize efficiency and reduce fuel consumption.
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Tag size={14} style={{color: 'var(--muted-foreground)'}} />
                <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>Optimization</span>
              </div>
              <button className="py-1 px-3 rounded-md border hover:opacity-80 transition-colors flex-shrink-0"
                      style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--accent)'}}>

                Add
              </button>
            </div>
          </div>
        </div>

        {/* Tool Card 3 */}
        <div className="dashboard-card rounded-lg hover:border-accent transition-colors overflow-hidden group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-md bg-accent/10">
                <Wrench size={24} className="text-accent" />
              </div>
              <div className="bg-background/20 text-muted-foreground text-xs py-1 px-2 rounded-full">
                Analytics
              </div>
            </div>
            <h3 className="font-medium text-lg mb-2">Performance Dashboard</h3>
            <p className="text-sm mb-4" style={{color: 'var(--muted-foreground)'}}>
              Comprehensive analytics dashboard for tracking KPIs, fleet performance, and delivery metrics.
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Tag size={14} style={{color: 'var(--muted-foreground)'}} />
                <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>Analytics</span>
              </div>
              <button className="py-1 px-3 rounded-md border hover:opacity-80 transition-colors flex-shrink-0"
                      style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--accent)'}}>

                Add
              </button>
            </div>
          </div>
        </div>

        {/* Tool Card 4 */}
        <div className="dashboard-card rounded-lg hover:border-accent transition-colors overflow-hidden group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-md bg-accent/10">
                <Wrench size={24} className="text-accent" />
              </div>
              <div className="bg-background/20 text-muted-foreground text-xs py-1 px-2 rounded-full">
                Communication
              </div>
            </div>
            <h3 className="font-medium text-lg mb-2">Automated Notifications</h3>
            <p className="text-sm mb-4" style={{color: 'var(--muted-foreground)'}}>
              Set up automatic notifications for customers, drivers, and warehouse staff based on shipment status.
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Tag size={14} style={{color: 'var(--muted-foreground)'}} />
                <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>Communication</span>
              </div>
              <button className="py-1 px-3 rounded-md border hover:opacity-80 transition-colors flex-shrink-0"
                      style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--accent)'}}>

                Add
              </button>
            </div>
          </div>
        </div>

        {/* Tool Card 5 */}
        <div className="dashboard-card rounded-lg hover:border-accent transition-colors overflow-hidden group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-md bg-accent/10">
                <Wrench size={24} className="text-accent" />
              </div>
              <div className="bg-background/20 text-muted-foreground text-xs py-1 px-2 rounded-full">
                Tracking
              </div>
            </div>
            <h3 className="font-medium text-lg mb-2">Real-time GPS Tracker</h3>
            <p className="text-sm mb-4" style={{color: 'var(--muted-foreground)'}}>
              Track your vehicles in real-time with advanced GPS technology and geofencing capabilities.
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Tag size={14} style={{color: 'var(--muted-foreground)'}} />
                <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>Tracking</span>
              </div>
              <button className="py-1 px-3 rounded-md border hover:opacity-80 transition-colors flex-shrink-0"
                      style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--accent)'}}>

                Add
              </button>
            </div>
          </div>
        </div>

        {/* Tool Card 6 */}
        <div className="dashboard-card rounded-lg hover:border-accent transition-colors overflow-hidden group cursor-pointer">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 rounded-md bg-accent/10">
                <Wrench size={24} className="text-accent" />
              </div>
              <div className="text-xs py-1 px-2 rounded-full" style={{backgroundColor: 'var(--accent-background)', color: 'var(--accent)'}}>
                Popular
              </div>
            </div>
            <h3 className="font-medium text-lg mb-2">Inventory Management</h3>
            <p className="text-sm mb-4" style={{color: 'var(--muted-foreground)'}}>
              Comprehensive inventory management system with forecasting, reordering, and warehouse optimization.
            </p>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Tag size={14} style={{color: 'var(--muted-foreground)'}} />
                <span className="text-xs" style={{color: 'var(--muted-foreground)'}}>Planning</span>
              </div>
              <button className="py-1 px-3 rounded-md border hover:opacity-80 transition-colors flex-shrink-0"
                      style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--accent)'}}>

                Add
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Load More */}
      <div className="flex justify-center mt-8">
        <button className="bg-accent-muted text-foreground py-2 px-6 rounded-md hover:bg-accent/10 transition-colors border border-border">
          Load More
        </button>
      </div>

      {/* Featured Section */}
      <section className="mt-12 bg-accent-muted rounded-lg border border-border p-6">
        <h2 className="text-xl font-semibold mb-2">Premium Tools Bundle</h2>
        <p className="text-muted-foreground mb-4">
          Get access to our complete suite of premium logistics tools at a discounted price.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="flex -space-x-3">
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border-2 border-background">
                <Wrench size={16} className="text-accent" />
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border-2 border-background">
                <Wrench size={16} className="text-accent" />
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center border-2 border-background">
                <Wrench size={16} className="text-accent" />
              </div>
              <div className="w-10 h-10 rounded-full bg-accent/40 flex items-center justify-center border-2 border-background">
                <span className="text-xs font-bold text-accent">+5</span>
              </div>
            </div>
            <div>
              <p className="font-medium">8 Premium Tools</p>
              <p className="text-sm text-muted-foreground">Save 30% with bundle pricing</p>
            </div>
          </div>
          <button className="bg-accent text-white py-2 px-6 rounded-md hover:bg-accent/90 transition-colors">
            View Bundle
          </button>
        </div>
      </section>
    </div>
  );
};

export default AllTools;
