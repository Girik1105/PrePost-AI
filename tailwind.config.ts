//created by kinjal
import type { Config } from "tailwindcss";

const v = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        paper: v("paper"),
        paper2: v("paper-2"),
        card: v("card"),
        ink: v("ink"),
        muted: v("muted"),
        line: v("line"),
        respect: v("respect"),
        compassion: v("compassion"),
        "compassion-deep": v("compassion-deep"),
        reflection: v("reflection"),
        "reflection-deep": v("reflection-deep"),
        integrity: v("integrity"),
        "integrity-deep": v("integrity-deep"),
        safe: v("safe"),
        caution: v("caution"),
        danger: v("danger"),
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        ios: ["-apple-system", "BlinkMacSystemFont", '"SF Pro Text"', "var(--font-sans)", "Inter", "sans-serif"],
      },
      boxShadow: {
        soft: "0 1px 2px rgb(30 36 64 / 0.06), 0 8px 24px -8px rgb(30 36 64 / 0.12)",
        lift: "0 2px 4px rgb(30 36 64 / 0.06), 0 24px 48px -16px rgb(30 36 64 / 0.22)",
      },
    },
  },
  plugins: [],
};
export default config;
