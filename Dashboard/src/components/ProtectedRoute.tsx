import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    // If user is not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  // If there are children, render them, otherwise render the Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
