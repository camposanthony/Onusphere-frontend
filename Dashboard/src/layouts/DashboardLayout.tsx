import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, BarChart2, Settings, LogOut, Package, Wrench } from 'lucide-react';
import { useState } from 'react';
import Logo from '../assets/logo.svg';
import ThemeToggle from '../components/ui/ThemeToggle';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      {/* Header */}
      <header className="h-16 flex items-center border-b fixed top-0 left-0 right-0 z-20" 
               style={{ borderColor: 'var(--border)', backgroundColor: 'var(--background)' }}>
        <div className="w-full flex items-center justify-between px-0">
          <div className="flex items-center">
            <button 
              onClick={toggleSidebar} 
              className="p-2 rounded-md hover:bg-background/10 ml-0 pl-4"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center ml-2">
              <img src={Logo} alt="Onusphere Logo" className="h-6 w-6 mr-2" />
              <span className="text-lg font-bold">Onusphere</span>
            </div>
          </div>
          <div className="mr-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <aside 
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out z-10 ${
            isSidebarOpen ? 'w-56' : 'w-16'
          }`}
          style={{ 
            backgroundColor: 'var(--muted)', 
            borderRight: '1px solid var(--border)'
          }}
        >
          <nav className="py-6 px-0">
            <ul className="space-y-6">
              <li>
                <Link to="/" className={`flex items-center p-2 rounded-md group pl-4 ${location.pathname === '/' ? 'active-nav' : ''}`}
                     style={{ color: 'var(--foreground)' }}>
                  <div className="min-w-[22px] flex justify-center">
                    <BarChart2 className={location.pathname === '/' ? 'text-accent' : 'text-muted-foreground group-hover:text-accent'} size={22} />
                  </div>
                  <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}>Dashboard</span>
                </Link>
              </li>
              <li>
                <Link to="/my-tools" className={`flex items-center p-2 rounded-md group pl-4 ${location.pathname === '/my-tools' ? 'active-nav' : ''}`}
                     style={{ color: 'var(--foreground)' }}>
                  <div className="min-w-[22px] flex justify-center">
                    <Wrench className={location.pathname === '/my-tools' ? 'text-accent' : 'text-muted-foreground group-hover:text-accent'} size={22} />
                  </div>
                  <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}>My Tools</span>
                </Link>
              </li>
              <li>
                <Link to="/all-tools" className={`flex items-center p-2 rounded-md group pl-4 ${location.pathname === '/all-tools' ? 'active-nav' : ''}`}
                     style={{ color: 'var(--foreground)' }}>
                  <div className="min-w-[22px] flex justify-center">
                    <Package className={location.pathname === '/all-tools' ? 'text-accent' : 'text-muted-foreground group-hover:text-accent'} size={22} />
                  </div>
                  <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}>All Tools</span>
                </Link>
              </li>
              <li className="pt-4 mt-4" style={{ borderTop: '1px solid var(--border)' }}>
                <a href="#" className="flex items-center p-2 rounded-md group pl-4"
                   style={{ color: 'var(--foreground)' }}>
                  <div className="min-w-[22px] flex justify-center">
                    <Settings className="text-muted-foreground group-hover:text-accent" size={22} />
                  </div>
                  <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}>Settings</span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-2 rounded-md group pl-4"
                   style={{ color: 'var(--foreground)' }}>
                  <div className="min-w-[22px] flex justify-center">
                    <LogOut className="text-muted-foreground group-hover:text-accent" size={22} />
                  </div>
                  <span className={`ml-3 whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${isSidebarOpen ? 'max-w-[180px] opacity-100' : 'max-w-0 opacity-0'}`}>Logout</span>
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-56 pl-8' : 'ml-16 pl-4'}`}>
          <div className="max-w-7xl mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
