/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        // Dark mode colors (original)
        'charcoal': '#000000',        // Main dark background color
        'slate-gray': '#0D0D0D',      // Slightly lighter version of charcoal
        'medium-gray': '#505055',
        'light-gray': '#D8D8D8',
        'accent-green': '#eb8934',    // Accent color
        'accent-purple': '#eb8934',   // Accent color
        'electric-blue': '#eb8934',   // Kept for backward compatibility
        
        // Light mode colors
        'light-bg': '#ffffff',        // Main light background
        'light-card': '#f5f7fa',      // Light card background
        'light-border': '#e5e7eb',    // Light border color
        'dark-text': '#1f2937',       // Dark text for light mode
        'secondary-text': '#4b5563',  // Secondary text for light mode
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      zIndex: {
        '-10': '-10',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #60a5fa, #fdba74)',
      },
    },
  },
  plugins: [],
};