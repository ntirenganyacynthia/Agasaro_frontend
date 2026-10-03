/** @type {import('tailwindcss').Config} */
const nextConfig = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1F6F5C",
          dark: "#123B31",
          light: "#E7F3EF",
        },
        accent: {
          DEFAULT: "#CE7B4B",
          dark: "#A8602F",
          light: "#F6E6D8",
        },
        cream: "#FBF8F3",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};

module.exports = nextConfig;
