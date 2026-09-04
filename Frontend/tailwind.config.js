/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#F93822",
          50: "#FEF1EF",
          100: "#FDE0DC",
          200: "#FBC1B9",
          300: "#F99C8F",
          400: "#FA6F5B",
          500: "#F93822",
          600: "#E0201A",
          700: "#B0170F",
          800: "#84130B",
          900: "#5C0E08",
        },
        secondary: {
          DEFAULT: "#002657",
          50: "#E6EBF2",
          100: "#C0CCE0",
          200: "#8FA3C6",
          300: "#5D79AB",
          400: "#375996",
          500: "#002657",
          600: "#00224E",
          700: "#001A3D",
          800: "#00132D",
          900: "#000B1C",
        },
      },
      fontFamily: {
        sans: ["Phetsarath OT", "Noto Sans Lao", "Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 38, 87, 0.08), 0 1px 2px -1px rgba(0, 38, 87, 0.08)",
        "card-hover": "0 4px 12px -2px rgba(0, 38, 87, 0.12)",
      },
    },
  },
  plugins: [],
};
