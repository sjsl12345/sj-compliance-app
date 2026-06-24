/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        teal: {
          50: '#E1F5EE',
          100: '#C3EBdd',
          400: '#9FE1CB',
          500: '#1D9E75',
          600: '#0F6E56',
          700: '#094D3C',
        },
        pink: {
          50: '#F7E0E3',
          100: '#F0C1C7',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
