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
        zen: {
          bg: "#fcfbf7",
          card: "#ffffff",
          primary: "#233d36",
          hover: "#182a25",
          accent: "#10b981",
          muted: "#60726d",
          border: "#e7e5de",
          surface: "#f4f2ea",
        }
      },
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
