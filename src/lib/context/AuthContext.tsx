'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, removeToken } from '../services/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  logout: () => void;
  setAuthenticated: (status: boolean) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: true,
  logout: () => {},
  setAuthenticated: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if token exists on first load
    const token = getToken();
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  const logout = () => {
    removeToken();
    setIsAuthenticated(false);
    router.push('/auth/login');
  };

  const setAuthenticated = (status: boolean) => {
    setIsAuthenticated(status);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        logout,
        setAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
