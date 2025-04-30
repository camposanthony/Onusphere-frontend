import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark'); // Default to dark
  
  // Initialize theme on component mount
  useEffect(() => {
    // Get stored theme or use system preference
    const storedTheme = localStorage.getItem('theme') as Theme;
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
    
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);
  
  // Apply theme whenever it changes
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);
  
  // Toggle between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };
  
  // Helper function to apply theme
  const applyTheme = (newTheme: Theme) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
