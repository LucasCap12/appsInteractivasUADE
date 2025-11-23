/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Activar dark mode con clase en <html>
  theme: {
    extend: {
      colors: {
        // Semantic Palette (Rebranded: Violet + Turquoise)
        primary: {
          DEFAULT: '#6D28D9', // Violeta (Accessible on white)
          dark: '#5B21B6',    // Violeta oscuro
          light: '#8B5CF6',   // Violeta claro
        },
        secondary: {
          DEFAULT: '#2DD4BF', // Turquesa (Accent)
          dark: '#14B8A6',
        },
        accent: {
          DEFAULT: '#2DD4BF', // Turquesa
          hover: '#14B8A6',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#2d2d2d',
          hover: '#f5f5f5',
          'dark-hover': '#3d3d3d',
        },
        background: {
          DEFAULT: '#f3f4f6', // Light Gray (Neutral)
          dark: '#1a1a1a',
        },
        text: {
          primary: '#1f2937', // Gray 800
          secondary: '#4b5563', // Gray 600
          'dark-primary': '#e0e0e0',
          'dark-secondary': '#a0a0a0',
        },
        // Legacy colors (kept for backward compatibility)
        'ml-yellow': '#FFE000',
        'ml-yellow-dark': '#CCBB00',
        'ml-blue': '#3483fa',
        'ml-light-blue': '#4a90e2',
        'ml-blue-dark': '#2870d9',
        'ml-green': '#00a650',
        'ml-light-gray': '#f5f5f5',
        'ml-dark-bg': '#1a1a1a',
        'ml-dark-card': '#2d2d2d',
        'ml-dark-border': '#404040',
      },
      boxShadow: {
        'card': '0 1px 2px 0 rgba(0,0,0,0.1)',
        'card-hover': '0 10px 20px rgba(0,0,0,0.12), 0 4px 8px rgba(0,0,0,0.06)',
        'elevation-1': '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
        'elevation-2': '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
