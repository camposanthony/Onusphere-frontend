'use client';

import { useState, useEffect } from 'react';
import { authGet } from '../utils/api';
import { useAuth } from '../context/AuthContext';

export interface User {
  id: string;
  name: string;
  email: string;
  company_name?: string;
  company_type?: string;
}

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      if (!isAuthenticated) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        // This endpoint should be implemented on the backend to return the current user info
        const userData = await authGet<User>('/me');
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user');
        // If the error is due to unauthorized access, log the user out
        if (err instanceof Error && err.message.includes('401')) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isAuthenticated, logout]);

  return { user, loading, error };
};
