import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md flex items-center justify-center transition-colors"
      style={{
        backgroundColor: isDarkMode ? 'transparent' : 'var(--toggle-background)',
        border: isDarkMode ? 'none' : '1px solid var(--border)',
      }}
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? (
        <Sun size={20} style={{color: 'var(--foreground)'}} />
      ) : (
        <Moon size={20} style={{color: '#6b7280'}} />
      )}
    </button>
  );
};

export default ThemeToggle;
