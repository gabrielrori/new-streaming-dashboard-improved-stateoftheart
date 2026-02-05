import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        success: "var(--success)",
        error: "var(--error)",
        warning: "var(--warning)",
        info: "var(--info)",
      },
      // Custom border radius scale
      borderRadius: {
        'sm': '0.25rem',    // 4px
        'DEFAULT': '0.5rem', // 8px
        'md': '0.75rem',    // 12px
        'lg': '1rem',       // 16px
        'xl': '1.5rem',     // 24px
        '2xl': '2rem',      // 32px
      },
      // Premium backdrop blur utilities
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
        '2xl': '40px',
        '3xl': '64px',
      },
      // Custom box shadow scale with colored glows
      boxShadow: {
        'glow-sm': '0 2px 8px rgba(16, 185, 129, 0.15)',
        'glow-md': '0 4px 16px rgba(16, 185, 129, 0.2)',
        'glow-lg': '0 8px 32px rgba(16, 185, 129, 0.3)',
        'glow-blue-sm': '0 2px 8px rgba(14, 165, 233, 0.15)',
        'glow-blue-md': '0 4px 16px rgba(14, 165, 233, 0.2)',
        'glow-blue-lg': '0 8px 32px rgba(14, 165, 233, 0.3)',
        'glow-amber-sm': '0 2px 8px rgba(245, 158, 11, 0.15)',
        'glow-amber-md': '0 4px 16px rgba(245, 158, 11, 0.2)',
        'glow-amber-lg': '0 8px 32px rgba(245, 158, 11, 0.3)',
        'glow-rose-sm': '0 2px 8px rgba(244, 63, 94, 0.15)',
        'glow-rose-md': '0 4px 16px rgba(244, 63, 94, 0.2)',
        'glow-rose-lg': '0 8px 32px rgba(244, 63, 94, 0.3)',
      },
      // Custom animation keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)' },
          '50%': { boxShadow: '0 0 30px rgba(16, 185, 129, 0.5)' },
        },
      },
      // Custom animations
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out',
        slideUp: 'slideUp 0.6s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
      },
      // Custom transition timing functions
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
export default config;
