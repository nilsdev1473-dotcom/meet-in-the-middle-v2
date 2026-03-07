import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card-bg)",
        muted: "var(--muted)",
        "ios-blue": "var(--ios-blue)",
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        cta: "var(--cta)",
      },
      spacing: {
        // 8px base grid
        "1": "8px",
        "2": "16px",
        "3": "24px",
        "4": "32px",
        "5": "40px",
        "6": "48px",
        "7": "56px",
        "8": "64px",
        "9": "72px",
        "10": "80px",
        "11": "44px", // iOS touch target (44px)
        "12": "96px",
        "13": "52px",
        "14": "112px",
        "16": "128px",
        "20": "160px",
        "24": "192px",
        "32": "256px",
        "40": "320px",
        "48": "384px",
        "56": "448px",
        "64": "512px",
        // Keep fractional and standard values
        "0": "0px",
        "0.5": "2px",
        "1.5": "12px",
        "2.5": "20px",
        "3.5": "28px",
        "px": "1px",
      },
      fontFamily: {
        "sf-pro": ["SF Pro Display", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        ios: "0 2px 8px rgba(0, 0, 0, 0.08)",
        "ios-lg": "0 4px 16px rgba(0, 0, 0, 0.12)",
        "ios-sm": "0 1px 4px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
