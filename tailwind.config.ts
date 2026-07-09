import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#0d0d0d",
        surface: "#161616",
        card: "#1e1e1e",
        card2: "#252525",
        border: "#2e2e2e",
        textPrimary: "#ffffff",
        textMuted: "#8e8e93",
        textDim: "#636366",
        "mrkt-yellow": "#f5c518",
        "mrkt-yellow-dim": "#c9a000",
        ton: "#4db8ff",
        success: "#30d158",
        danger: "#ff453a"
      },
      fontFamily: {
        sans: ["-apple-system", "BlinkMacSystemFont", "SF Pro Text", "Segoe UI", "Roboto", "sans-serif"]
      },
      boxShadow: {
        card: "0 2px 12px rgba(0,0,0,.5)"
      },
      animation: {
        "slide-up": "slideUp .3s cubic-bezier(.22,1,.36,1)",
        "fade-in": "fadeIn .2s ease"
      },
      keyframes: {
        slideUp: { "0%": { transform: "translateY(100%)" }, "100%": { transform: "translateY(0)" } },
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } }
      }
    }
  },
  plugins: []
} satisfies Config;
