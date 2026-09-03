/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0f172a',
          blue: '#1e3a8a',
          emerald: '#047857',
          sky: '#0284c7',
          gold: '#d97706',
          saffron: '#ea580c'
        }
      }
    },
  },
  plugins: [],
}
