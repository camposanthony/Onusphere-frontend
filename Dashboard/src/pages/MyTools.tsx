import { Search, Truck, ChevronRight, Plus, Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyTools = () => {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gradient">My Tools</h1>
        <p style={{color: 'var(--muted-foreground)'}} className="mt-1">
          Manage and access your logistics tools in one place
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} style={{color: 'var(--muted-foreground)'}} />
          </div>
          <input
            type="text"
            placeholder="Search tools..."
            className="pl-10 pr-4 py-2 border rounded-md w-full md:w-80 focus:outline-none focus:ring-1 focus:ring-accent"
            style={{backgroundColor: 'var(--muted)', borderColor: 'var(--border)'}}
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
          <Link to="/tools/truck-loading-helper" className="dashboard-card rounded-lg hover:border-accent transition-colors overflow-hidden group cursor-pointer">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-md bg-accent/10">
                  <Truck size={24} className="text-accent" />
                </div>
                <div className="text-xs py-1 px-2 rounded-full" style={{backgroundColor: 'var(--accent-background)', color: 'var(--accent)'}}>
                  Active
                </div>
              </div>
              <h3 className="font-medium text-lg mb-2">Truck Loading Helper</h3>
              <p className="text-sm mb-4" style={{color: 'var(--muted-foreground)'}}>
                Manage customers and their orders for efficient truck loading operations.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs flex items-center" style={{color: 'var(--muted-foreground)'}}>
                  <Clock size={12} className="mr-1" />
                  Last used: Today
                </span>
                <ChevronRight size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Tools */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Clock size={20} className="text-accent mr-2" />
          Recently Used
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/tools/truck-loading-helper" className="dashboard-card rounded-lg hover:border-accent transition-colors overflow-hidden group cursor-pointer">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-md bg-accent/10">
                  <Truck size={24} className="text-accent" />
                </div>
                <div className="text-xs py-1 px-2 rounded-full" style={{backgroundColor: 'var(--accent-background)', color: 'var(--accent)'}}>
                  Active
                </div>
              </div>
              <h3 className="font-medium text-lg mb-2">Truck Loading Helper</h3>
              <p className="text-sm mb-4" style={{color: 'var(--muted-foreground)'}}>
                Manage customers and their orders for efficient truck loading operations.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs flex items-center" style={{color: 'var(--muted-foreground)'}}>
                  <Clock size={12} className="mr-1" />
                  Last used: Today
                </span>
                <ChevronRight size={16} className="text-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* All My Tools */}
      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Truck size={20} className="text-accent mr-2" />
          All My Tools
        </h2>
        <div className="dashboard-card overflow-hidden">
          <table className="w-full text-sm">
            <thead style={{backgroundColor: 'var(--muted)'}}>
              <tr>
                <th className="px-6 py-3 text-left font-medium">Tool Name</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Last Used</th>
                <th className="px-6 py-3 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr style={{transition: 'background-color 0.2s'}} className="hover-row">
                <td className="px-6 py-4">Truck Loading Helper</td>
                <td className="px-6 py-4">
                  <span className="text-xs py-1 px-2 rounded-full" style={{backgroundColor: 'var(--accent-background)', color: 'var(--accent)'}}>
                    Active
                  </span>
                </td>
                <td className="px-6 py-4">Today</td>
                <td className="px-6 py-4">
                  <Link to="/tools/truck-loading-helper">
                    <button className="py-1 px-3 rounded-md border transition-colors hover:opacity-80" style={{backgroundColor: 'var(--background)', color: 'var(--accent)', borderColor: 'var(--border)'}}>
                      Open
                    </button>
                  </Link>
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
