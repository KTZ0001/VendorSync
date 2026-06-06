/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        foreground: "#0F172A",
        muted: "#F1F5F9",
        "muted-foreground": "#64748B",
        border: "#E2E8F0",
        primary: {
          DEFAULT: "#0F172A", // Apple-style deep neutral
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F8FAFC",
          foreground: "#0F172A",
        },
        success: "#10B981",
        warning: "#F59E0B",
        danger: "#EF4444",
        indigo: "#6366F1",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        'soft': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'premium': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
