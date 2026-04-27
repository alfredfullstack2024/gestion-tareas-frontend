/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // 🔥 AQUÍ estaba el desastre
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
