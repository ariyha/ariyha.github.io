/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
        'mono': ['Fira Code', 'monospace'],
      },
      colors: {
        'custom-dark': '#0D1B2A',
      },
      animation: {
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}