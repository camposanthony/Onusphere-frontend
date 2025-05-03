import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MyTools from './pages/MyTools';
import AllTools from './pages/AllTools';
import TruckLoadingHelper from './pages/TruckLoadingHelper';
import { ThemeProvider } from './components/ui/ThemeProvider';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="my-tools" element={<MyTools />} />
          <Route path="all-tools" element={<AllTools />} />
          <Route path="tools/truck-loading-helper" element={<TruckLoadingHelper />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
