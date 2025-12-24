/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          yellow: '#facc15',
          dark: '#1f2937',
        },
      },
    },
  },
  plugins: [],
}
