import tailwindcssAnimate from 'tailwindcss-animate';

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        'background': '#000000',
        'foreground': '#ffffff',
        'muted': '#1a1a1a',
        'muted-foreground': '#a3a3a3',
        'accent': '#eb8934',
        'accent-muted': '#0D0D0D',
        'primary': '#eb8934',
        'primary-foreground': '#ffffff',
        'secondary': '#0D0D0D',
        'secondary-foreground': '#ffffff',
        'destructive': '#ff4d4f',
        'destructive-foreground': '#ffffff',
        'border': '#2a2a2a',
        'input': '#1a1a1a',
        'ring': '#eb8934',
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
