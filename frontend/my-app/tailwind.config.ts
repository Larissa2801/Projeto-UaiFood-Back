// frontend/my-app/tailwind.config.ts

import type { Config } from "tailwindcss";

const config: Config = {
  // Onde o Tailwind deve procurar por classes CSS
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // 🎨 DEFINIÇÃO DA COR LARANJA (PRIMARY)
        primary: {
          // O valor hexadecimal #FF8000 corresponde a um laranja forte, ideal para o UAIFood
          DEFAULT: "#FF8000",
          foreground: "hsl(var(--primary-foreground))", // Geralmente branco/preto
        },
        // Adicione outras cores que você precisa (ex: background, muted, etc.)
        background: "hsl(var(--background))",
        muted: "hsl(var(--muted))",
      },
    },
  },
  plugins: [],
};

export default config;
