/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'charcoal': '#000000',        // Updated main background color
        'slate-gray': '#0D0D0D',      // Slightly lighter version of charcoal
        'medium-gray': '#505055',
        'light-gray': '#D8D8D8',
        'accent-green': '#eb8934',    // New accent color
        'accent-purple': '#eb8934',   // New accent color
        'electric-blue': '#eb8934',   // Kept for backward compatibility
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
    },
  },
  plugins: [],
};