import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import MyTools from './pages/MyTools';
import AllTools from './pages/AllTools';
import TruckLoadingHelper from './pages/TruckLoadingHelper';
import Login from './pages/Auth/Login';
import SignUp from './pages/Auth/SignUp';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ui/ThemeProvider';
import './index.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          
          {/* Protected main app routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="my-tools" element={<MyTools />} />
              <Route path="all-tools" element={<AllTools />} />
              <Route path="tools/truck-loading-helper" element={<TruckLoadingHelper />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
