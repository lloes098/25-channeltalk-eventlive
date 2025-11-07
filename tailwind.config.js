/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'point': '#C2FE0F',
        'bg-dark': '#17161C',
        'card-bg': '#1F1E24',
        'border-dark': '#2A2930',
      },
    },
  },
  plugins: [],
}

