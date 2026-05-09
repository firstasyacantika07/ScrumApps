/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Menambahkan warna merah khas ScrumApps Anda
        'scrum-red': '#ee1e2d',
      }
    },
  },
  plugins: [],
}