/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ml-yellow': '#FFF159',
        'ml-blue': '#3483fa',
        'ml-light-blue': '#4a90e2',
        'ml-green': '#00a650',
        'ml-light-gray': '#f5f5f5',
      }
    },
  },
  plugins: [],
}
