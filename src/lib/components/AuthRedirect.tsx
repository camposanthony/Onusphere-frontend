'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export function AuthRedirectHandler() {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  // This will listen for 401 errors from fetch requests
  useEffect(() => {
    const handleUnauthorized = (event: Event) => {
      // Check if the event is an error response from our API
      const customEvent = event as CustomEvent<Response>;
      if (customEvent?.detail?.status === 401) {
        // Token is likely expired - log the user out
        logout();
      }
    };
    
    // Add event listener for API unauthorized errors
    window.addEventListener('api:unauthorized', handleUnauthorized as EventListener);
    
    return () => {
      window.removeEventListener('api:unauthorized', handleUnauthorized as EventListener);
    };
  }, [logout]);
  
  return null; // This component doesn't render anything
}
