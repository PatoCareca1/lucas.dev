/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'manjaro-green': '#35bf5c',
        'terminal-bg': '#0f1419',
        'terminal-border': '#2d333b',
      }
    },
  },
  plugins: [],
}

