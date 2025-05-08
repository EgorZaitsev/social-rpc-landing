import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1350px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2F4F4F", // Глубокий хвойно-зелёный
          foreground: "#E5E2D4", // Светлый песочный/серо-бежевый
          dark: "#2F4F4F", // Глубокий хвойно-зелёный
          light: "#E5E2D4", // Светлый песочный/серо-бежевый
        },
        secondary: {
          DEFAULT: "#5B3A29", // Тёплый древесный коричневый
          foreground: "#E5E2D4", // Светлый песочный/серо-бежевый
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "#E5E2D4", // Светлый песочный/серо-бежевый
          foreground: "#2F4F4F", // Глубокий хвойно-зелёный
        },
        accent: {
          DEFAULT: "#C9A75E", // Золотистый (иконописный)
          foreground: "#2F4F4F", // Глубокий хвойно-зелёный
          gold: "#C9A75E", // Золотистый (иконописный)
          mint: "#5B3A29", // Тёплый древесный коричневый
          green: "#2F4F4F", // Глубокий хвойно-зелёный
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        cedar: {
          green: "#2F4F4F", // Глубокий хвойно-зелёный
          brown: "#5B3A29", // Тёплый древесный коричневый
          beige: "#E5E2D4", // Светлый песочный/серо-бежевый
          gold: "#C9A75E", // Золотистый (иконописный)
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/aspect-ratio")],
} satisfies Config

export default config
