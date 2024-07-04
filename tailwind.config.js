/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
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
          DEFAULT: "#b361d4",
          foreground: "hsl(var(--primary-foreground))",
          50: "#fbf6fd",
          100: "#f6ecfb",
          200: "#ecd7f7",
          300: "#deb8ef",
          400: "#cb8de5",
          500: "#b361d4",
          600: "#9841b8",
          700: "#7f3398",
          800: "#743089",
          900: "#592867",
          950: "#381042",
        },
        secondary: {
          DEFAULT: "#d362c4",
          foreground: "hsl(var(--secondary-foreground))",
          50: "#fdf6fc",
          100: "#fbecfa",
          200: "#f6d8f4",
          300: "#efb8e8",
          400: "#e48ed9",
          500: "#d362c4",
          600: "#b643a3",
          700: "#8a307a",
          800: "#7b2d6c",
          900: "#662959",
          950: "#421038",
        },
        destructive: {
          DEFAULT: "#8A3045",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: "#308A3E",
        dark: "#250F2C",
        light: "#E9E7EA",
        muted: {
          DEFAULT: "#928795",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
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
  plugins: [require("tailwindcss-animate"), require("daisyui")],
};
