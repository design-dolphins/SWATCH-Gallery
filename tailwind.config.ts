import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#101010",
        bone: "#F7F4F3",
        mist: "#e8ecef",
        acid: "#FF7E21",
        coral: "#ff6b57"
      },
      boxShadow: {
        soft: "0 20px 70px rgba(16, 16, 16, 0.12)"
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "system-ui", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
