import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        text: "var(--color-text)",
        surface: "var(--color-surface)",
        surfaceEdge: "var(--color-surface-edge)",
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        success: "var(--color-success)",
        danger: "var(--color-danger)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        heading: ["var(--font-plus-jakarta-sans)"],
        body: ["var(--font-inter)"],
      },
      boxShadow: {
        neu: "0 24px 55px -30px rgba(83, 58, 214, 0.65), 0 14px 32px -24px rgba(0, 145, 255, 0.55)",
        "neu-inset": "inset 0 1px 0 rgba(255, 255, 255, 0.45), inset 0 -1px 0 rgba(102, 71, 240, 0.25)",
        soft: "0 10px 30px -22px rgba(15, 23, 42, 0.35)",
      },
      borderRadius: {
        neu: "18px",
      },
    },
  },
  plugins: [],
};

export default config;
