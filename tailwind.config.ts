import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Four Seasons Brand Colors
        fs: {
          black: "#000000",
          white: "#FFFFFF",
          gold: "#B8860B",
          "gold-light": "#D4A84B",
          "dark-green": "#1A3D2E",
        },
        // Gray scale
        gray: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          200: "#E9ECEF",
          300: "#DEE2E6",
          400: "#CED4DA",
          500: "#ADB5BD",
          600: "#6C757D",
          700: "#495057",
          800: "#343A40",
          900: "#212529",
        },
        // Status colors
        status: {
          success: "#2E7D32",
          warning: "#ED6C02",
          info: "#0288D1",
          high: "#C62828",
        },
      },
      fontFamily: {
        display: ["EB Garamond", "Georgia", "serif"],
        body: ["Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
