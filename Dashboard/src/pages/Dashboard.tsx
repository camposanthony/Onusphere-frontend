import { BarChart, MessageSquare, TrendingUp, Clock, Truck } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient">Dashboard</h1>
        <p style={{color: 'var(--muted-foreground)'}} className="mt-1">
          Welcome to Onusphere, your modular logistics toolbox
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="dashboard-card p-6 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p style={{color: 'var(--muted-foreground)'}} className="text-sm">Active Shipments</p>
              <h3 className="text-2xl font-bold mt-1">24</h3>
              <p style={{color: 'var(--accent)'}} className="text-xs mt-2 flex items-center">
                <TrendingUp size={12} className="mr-1" /> 
                +5% from last week
              </p>
            </div>
            <div style={{backgroundColor: 'var(--background)', opacity: 0.2}} className="p-3 rounded-md">
              <Truck size={24} className="text-accent" />
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p style={{color: 'var(--muted-foreground)'}} className="text-sm">Communications</p>
              <h3 className="text-2xl font-bold mt-1">148</h3>
              <p style={{color: 'var(--accent)'}} className="text-xs mt-2 flex items-center">
                <TrendingUp size={12} className="mr-1" /> 
                +12% from last week
              </p>
            </div>
            <div style={{backgroundColor: 'var(--background)', opacity: 0.2}} className="p-3 rounded-md">
              <MessageSquare size={24} className="text-accent" />
            </div>
          </div>
        </div>

        <div className="dashboard-card p-6 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              <p style={{color: 'var(--muted-foreground)'}} className="text-sm">Efficiency Score</p>
              <h3 className="text-2xl font-bold mt-1">92%</h3>
              <p style={{color: 'var(--accent)'}} className="text-xs mt-2 flex items-center">
                <TrendingUp size={12} className="mr-1" /> 
                +3% from last month
              </p>
            </div>
            <div style={{backgroundColor: 'var(--background)', opacity: 0.2}} className="p-3 rounded-md">
              <BarChart size={24} className="text-accent" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Tools Section */}
        <div className="lg:col-span-2 dashboard-card p-6 h-full">
          <h2 className="text-xl font-semibold mb-4">Active Tools</h2>
          
          <div className="space-y-4">
            <div style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)'}} className="p-4 rounded-md border flex items-center">
              <div style={{backgroundColor: 'var(--accent-background)'}} className="p-3 rounded-md mr-4 flex-shrink-0">
                <Truck size={20} className="text-accent" />
              </div>
              <div className="flex-1">
                <h3 style={{color: 'var(--muted-foreground)'}} className="font-medium">Truck Loading Optimizer</h3>
                <p style={{color: 'var(--muted-foreground)'}} className="text-sm">Currently optimizing 3 shipments</p>
              </div>
              <button style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--accent)'}} className="text-sm py-1 px-3 rounded-md border hover:opacity-80 transition-colors flex-shrink-0">
                Open
              </button>
            </div>
            
            <div style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)'}} className="p-4 rounded-md border flex items-center">
              <div style={{backgroundColor: 'var(--accent-background)'}} className="p-3 rounded-md mr-4 flex-shrink-0">
                <MessageSquare size={20} className="text-accent" />
              </div>
              <div className="flex-1">
                <h3 style={{color: 'var(--muted-foreground)'}} className="font-medium">Communication Automation Hub</h3>
                <p style={{color: 'var(--muted-foreground)'}} className="text-sm">42 messages processed today</p>
              </div>
              <button style={{backgroundColor: 'var(--background)', borderColor: 'var(--border)', color: 'var(--accent)'}} className="text-sm py-1 px-3 rounded-md border hover:opacity-80 transition-colors flex-shrink-0">
                Open
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="dashboard-card p-6 h-full">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          
          <div className="space-y-4">
            <div className="border-l-2 border-accent pl-4 pb-5 relative">
              <div className="absolute w-3 h-3 bg-accent rounded-full -left-[6.5px] top-1"></div>
              <div className="mt-4 space-y-3">
                <div className="flex items-center text-sm">
                  <Clock size={14} className="mr-2" style={{color: 'var(--muted-foreground)'}} />
                  <span style={{color: 'var(--muted-foreground)'}}>Today, 14:32</span>
                  <span className="mx-2" style={{color: 'var(--muted-foreground)'}}>•</span>
                  <span>Shipment ID #45291 updated</span>
                </div>
              </div>
            </div>
            
            <div className="border-l-2 border-border pl-4 pb-5 relative">
              <div className="absolute w-3 h-3 bg-muted-foreground rounded-full -left-[6.5px] top-1"></div>
              <span className="text-xs text-muted-foreground block mb-1 flex items-center">
                <Clock size={12} className="mr-1" />
                5 hours ago
              </span>
              <p className="text-sm">New Route Planner tool available</p>
            </div>
            
            <div className="border-l-2 border-border pl-4 relative">
              <div className="absolute w-3 h-3 bg-muted-foreground rounded-full -left-[6.5px] top-1"></div>
              <span className="text-xs text-muted-foreground block mb-1 flex items-center">
                <Clock size={12} className="mr-1" />
                Yesterday
              </span>
              <p className="text-sm">Loading optimization completed for Truck #A78</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
