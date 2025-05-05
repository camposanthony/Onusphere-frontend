import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// API base URL - update this to match your backend URL
const API_URL = 'http://localhost:8000'; // Adjust as needed

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface User {
  id: string;
  fullName: string;
  email: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated on load
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const authStatus = localStorage.getItem('isAuthenticated');
      const userData = localStorage.getItem('user');
      
      if (authToken && authStatus === 'true' && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      } else {
        // Clear any partial auth data
        localStorage.removeItem('authToken');
        localStorage.removeItem('tokenType');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Login failed');
      }

      const data = await response.json();
      
      // Store the token
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('tokenType', data.token_type || 'bearer');
      
      // The backend doesn't currently return user data with the token,
      // we can either fetch user data in a separate call or decode the JWT
      // For now, we'll store what we know
      const userData = {
        id: data.sub || 'unknown',
        fullName: 'User', // We don't have this from login response
        email: email
      };

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const signup = async (fullName: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          password: password
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Signup failed');
      }

      const data = await response.json();
      
      // Store the token
      localStorage.setItem('authToken', data.access_token);
      localStorage.setItem('tokenType', data.token_type || 'bearer');
      
      // Store user data
      const userData = {
        id: data.sub || 'unknown',
        fullName: fullName,
        email: email
      };

      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('user', JSON.stringify(userData));
      
      setIsAuthenticated(true);
      setUser(userData);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };

  const logout = () => {
    // Clear all auth-related data
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenType');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('user');
    
    // Update state
    setIsAuthenticated(false);
    setUser(null);
    
    // Redirect to login
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        signup,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
