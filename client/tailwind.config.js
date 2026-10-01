/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#050816',
        card: '#0B1220',
        primary: '#60A5FA',
        ice: '#BAE6FD',
        purple: '#818CF8',
        text: '#F8FAFC',
        muted: '#94A3B8',
        success: '#22C55E',
      },
    },
  },
  plugins: [],
}
