/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        porcelain: {
          50: '#FDFCFB',
          100: '#F8F6F3',
          200: '#F0EDE8',
          300: '#E5E0D8',
        },
        fog: {
          100: '#F2F2F7',
          200: '#E5E5EA',
          300: '#C7C7CC',
          400: '#AEAEB2',
          500: '#8E8E93',
          600: '#636366',
          700: '#48484A',
          800: '#3A3A3C',
          900: '#2C2C2E',
        },
        blush: {
          50: '#FDF8F7',
          100: '#F5EDEB',
          200: '#EDD8D3',
          300: '#E8D5D0',
          400: '#D4B5AE',
          500: '#C9A89F',
          600: '#A8796F',
        },
        teal: {
          50: '#E8F4F3',
          100: '#C8E8E5',
          200: '#A0D4CF',
          300: '#6BBFB8',
          400: '#3DADA4',
          500: '#2A9D8F',
          600: '#1E7268',
          700: '#155249',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
