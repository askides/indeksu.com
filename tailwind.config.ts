import forms from "@tailwindcss/forms";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Plus Jakarta Sans Variable", ...defaultTheme.fontFamily.sans],
        mono: ["Roboto Mono Variable", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [forms, typography],
} satisfies Config;
