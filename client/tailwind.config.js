/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ["Manrope", "san-serif"]
      },
      colors: {
       "washed-blue": "#0085FF"
      }
    },
  },
  plugins: [],
}