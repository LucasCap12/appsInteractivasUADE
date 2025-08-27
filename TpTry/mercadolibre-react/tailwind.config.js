/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#258df4',
        secondary: '#f0f2f5',
        text: '#111418',
        textMuted: '#60758a',
        border: '#dbe0e6'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Noto Sans"', 'sans-serif']
      }
    },
  },
  plugins: [],
}
