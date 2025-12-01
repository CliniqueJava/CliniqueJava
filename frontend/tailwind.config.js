/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        clinic: {
          dark: '#1e6262',
          secondary: '#2d767f',
          accent: '#b4f1f1',
          bg: '#ecfffb',
        },
      },
      boxShadow: {
        soft: '0 10px 30px rgba(30, 98, 98, 0.12)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}

