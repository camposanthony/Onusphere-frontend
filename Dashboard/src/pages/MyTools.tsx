import { Search, Wrench, ChevronRight, Plus, Star, Clock } from 'lucide-react';

const MyTools = () => {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">My Tools</h1>
        <p className="text-muted-foreground mt-1">
          Manage and access your logistics tools in one place
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search tools..."
            className="pl-10 pr-4 py-2 bg-accent-muted border border-border rounded-md w-full md:w-80 focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </div>
        <div className="flex items-center space-x-2">
          <button className="bg-accent text-white py-2 px-4 rounded-md hover:bg-accent/90 transition-colors flex items-center">
            <Plus size={18} className="mr-2" />
            Add Tool
          </button>
        </div>
      </div>

      {/* Favorite Tools */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Star size={20} className="text-accent mr-2" />
          Favorite Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-accent-muted rounded-lg border border-border hover:border-accent transition-colors overflow-hidden group cursor-pointer">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-md bg-accent/10">
                  <Wrench size={24} className="text-accent" />
                </div>
                <div className="bg-accent/10 text-accent text-xs py-1 px-2 rounded-full">
                  Active
                </div>
              </div>
              <h3 className="font-medium text-lg mb-2">Truck Loading Optimizer</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Optimize your truck loading patterns for maximum efficiency and reduced costs.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock size={12} className="mr-1" />
                  Last used: Today
                </span>
                <ChevronRight size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          <div className="bg-accent-muted rounded-lg border border-border hover:border-accent transition-colors overflow-hidden group cursor-pointer">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-md bg-accent/10">
                  <Wrench size={24} className="text-accent" />
                </div>
                <div className="bg-accent/10 text-accent text-xs py-1 px-2 rounded-full">
                  Active
                </div>
              </div>
              <h3 className="font-medium text-lg mb-2">Route Planner</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Plan optimal delivery routes with real-time traffic and weather considerations.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock size={12} className="mr-1" />
                  Last used: Yesterday
                </span>
                <ChevronRight size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Tools */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Clock size={20} className="text-accent mr-2" />
          Recently Used
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-accent-muted rounded-lg border border-border hover:border-accent transition-colors overflow-hidden group cursor-pointer">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-md bg-accent/10">
                  <Wrench size={24} className="text-accent" />
                </div>
                <div className="bg-background/20 text-muted-foreground text-xs py-1 px-2 rounded-full">
                  Available
                </div>
              </div>
              <h3 className="font-medium text-lg mb-2">Communication Hub</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Centralize all communications with drivers, warehouses, and customers.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock size={12} className="mr-1" />
                  Last used: 2 days ago
                </span>
                <ChevronRight size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>

          <div className="bg-accent-muted rounded-lg border border-border hover:border-accent transition-colors overflow-hidden group cursor-pointer">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-md bg-accent/10">
                  <Wrench size={24} className="text-accent" />
                </div>
                <div className="bg-background/20 text-muted-foreground text-xs py-1 px-2 rounded-full">
                  Available
                </div>
              </div>
              <h3 className="font-medium text-lg mb-2">Inventory Tracker</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Real-time tracking and management of warehouse inventory and shipments.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground flex items-center">
                  <Clock size={12} className="mr-1" />
                  Last used: 1 week ago
                </span>
                <ChevronRight size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* All My Tools */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Wrench size={20} className="text-accent mr-2" />
          All My Tools
        </h2>
        <div className="bg-accent-muted rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-background/20">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Tool Name</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Last Used</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr className="hover:bg-background/10 transition-colors">
                <td className="px-6 py-4">Truck Loading Optimizer</td>
                <td className="px-6 py-4">
                  <span className="bg-accent/10 text-accent text-xs py-1 px-2 rounded-full">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">Today</td>
                <td className="px-6 py-4">
                  <button className="text-accent hover:text-accent/80 bg-background py-1 px-3 rounded-md border border-border hover:bg-accent/5 transition-colors">
                    Open
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-background/10 transition-colors">
                <td className="px-6 py-4">Route Planner</td>
                <td className="px-6 py-4">
                  <span className="bg-accent/10 text-accent text-xs py-1 px-2 rounded-full">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">Yesterday</td>
                <td className="px-6 py-4">
                  <button className="text-accent hover:text-accent/80 bg-background py-1 px-3 rounded-md border border-border hover:bg-accent/5 transition-colors">
                    Open
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-background/10 transition-colors">
                <td className="px-6 py-4">Communication Hub</td>
                <td className="px-6 py-4">
                  <span className="bg-background/20 text-muted-foreground text-xs py-1 px-2 rounded-full">
                    Available
                  </span>
                </td>
                <td className="px-6 py-4">2 days ago</td>
                <td className="px-6 py-4">
                  <button className="text-accent hover:text-accent/80 bg-background py-1 px-3 rounded-md border border-border hover:bg-accent/5 transition-colors">
                    Open
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-background/10 transition-colors">
                <td className="px-6 py-4">Inventory Tracker</td>
                <td className="px-6 py-4">
                  <span className="bg-background/20 text-muted-foreground text-xs py-1 px-2 rounded-full">
                    Available
                  </span>
                </td>
                <td className="px-6 py-4">1 week ago</td>
                <td className="px-6 py-4">
                  <button className="text-accent hover:text-accent/80 bg-background py-1 px-3 rounded-md border border-border hover:bg-accent/5 transition-colors">
                    Open
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-background/10 transition-colors">
                <td className="px-6 py-4">Shipment Tracker</td>
                <td className="px-6 py-4">
                  <span className="bg-background/20 text-muted-foreground text-xs py-1 px-2 rounded-full">
                    Available
                  </span>
                </td>
                <td className="px-6 py-4">2 weeks ago</td>
                <td className="px-6 py-4">
                  <button className="text-accent hover:text-accent/80 bg-background py-1 px-3 rounded-md border border-border hover:bg-accent/5 transition-colors">
                    Open
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default MyTools;
