/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vet: {
          primary: '#059669',
          secondary: '#10b981',
          dark: '#047857',
        },
      },
    },
  },
  plugins: [],
}
