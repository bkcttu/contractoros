/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1C1008',
          50: '#F5EDE4',
          100: '#EBDBC9',
          200: '#D7B793',
          300: '#C3935D',
          400: '#906A3A',
          500: '#1C1008',
          600: '#160D06',
          700: '#110A05',
          800: '#0B0703',
          900: '#060302',
        },
        accent: {
          DEFAULT: '#FF6B35',
          50: '#FFF3ED',
          100: '#FFE7DB',
          200: '#FFCFB7',
          300: '#FFB793',
          400: '#FF9F6F',
          500: '#FF6B35',
          600: '#E55A26',
          700: '#CC4A18',
          800: '#B23A0A',
          900: '#992A00',
        },
        cream: {
          DEFAULT: '#FFF7ED',
          50: '#FFFCF8',
          100: '#FFF7ED',
          200: '#FFEFD6',
        },
      },
      fontFamily: {
        heading: ['DM Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
