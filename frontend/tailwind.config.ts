import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        enactus: {
          yellow: "#FFC220",
          "dark-gray": "#515456",
          navy: "#132240",
          "light-gray": "#B0B3B8",
        },
      },
      fontFamily: {
        heading: ["var(--font-display)"],
        body: ["var(--font-body)"],
        tagline: ["var(--font-tagline)"],
      },
      maxWidth: {
        content: "1280px",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        reveal: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shape-in": {
          "0%": { opacity: "0", transform: "scale(0.4) rotate(-20deg)" },
          "65%": { opacity: "1", transform: "scale(1.06) rotate(2deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(0deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.6s ease-out forwards",
        reveal: "reveal 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "shape-in": "shape-in 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
