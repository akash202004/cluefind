import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        feature: {
          purple: "hsl(var(--feature-purple))",
          blue: "hsl(var(--feature-blue))",
          yellow: "hsl(var(--feature-yellow))",
          green: "hsl(var(--feature-green))",
          red: "hsl(var(--feature-red))",
          indigo: "hsl(var(--feature-indigo))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["ui-monospace", "SFMono-Regular", "SF Mono", "Consolas", "Liberation Mono", "Menlo", "monospace"],
        mono: ["ui-monospace", "SFMono-Regular", "SF Mono", "Consolas", "Liberation Mono", "Menlo", "monospace"],
      },
      boxShadow: {
        "brutalist": "8px 8px 0px 0px rgba(0,0,0,1)",
        "brutalist-sm": "4px 4px 0px 0px rgba(0,0,0,1)",
        "brutalist-lg": "12px 12px 0px 0px rgba(0,0,0,1)",
        "brutalist-hover": "4px 4px 0px 0px rgba(0,0,0,1)",
      },
      animation: {
        "float": "float 6s ease-in-out infinite",
        "tilt": "tilt 10s infinite linear",
      },
    },
  },
  plugins: [],
};

export default config;
