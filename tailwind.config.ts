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
        smoke: {
          black: "#0A0A0A",
          dark: "#141414",
          card: "#1E1E1E",
          border: "#2A2A2A",
          gold: "#D4AF37",
          "gold-light": "#F4D03F",
          "gold-dark": "#B8860B",
          red: "#8B1A1A",
          "red-light": "#C0392B",
          white: "#F5F5F5",
          muted: "#9CA3AF",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;