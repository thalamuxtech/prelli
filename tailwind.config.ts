import type { Config } from "tailwindcss";

/**
 * PreLLI design tokens (Implementation Plan §2).
 * Colors are exposed both as Tailwind utilities and via CSS variables (globals.css)
 * so they can be themed (dark mode) without recompiling.
 */
const config: Config = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./src/**/*.{ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        prelli: {
          green: {
            DEFAULT: "#7BBA3C",
            50: "#F1F7E8",
            600: "#69A330",
          },
          blue: {
            DEFAULT: "#2D9CDB",
            700: "#1F73A3",
          },
          orange: {
            DEFAULT: "#F2A33C",
            50: "#FEF4E6",
          },
          pink: { DEFAULT: "#EB5286" },
        },
        ink: "#1B2430",
        slate: "#5A6472",
        line: "#E7ECE3",
        cloud: "#F6F8F5",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        sm: "8px",
        md: "14px",
        lg: "22px",
        pill: "999px",
      },
      boxShadow: {
        e1: "0 1px 2px rgba(16,24,32,.06)",
        e2: "0 8px 24px -8px rgba(16,24,32,.18)",
        e3: "0 24px 60px -12px rgba(16,24,32,.28)",
      },
      maxWidth: {
        content: "1200px",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(.22,1,.36,1)",
        soft: "cubic-bezier(.4,0,.2,1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up .5s cubic-bezier(.22,1,.36,1) both",
        marquee: "marquee 28s linear infinite",
        shimmer: "shimmer 1.6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
