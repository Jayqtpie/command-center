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
        linen: { DEFAULT: "#f5f0eb", dark: "#ece5dc" },
        terracotta: { DEFAULT: "#c67a3c", dark: "#b5693a", light: "#d4956a" },
        border: "#e0d8cf",
      },
      fontFamily: {
        serif: ['"Palatino Linotype"', "Palatino", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
