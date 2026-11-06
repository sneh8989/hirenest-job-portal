/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: "#075E54",       // Primary forest green
          darkgreen: "#054c44",
          teal: "#123B36",        // Deep teal
          ivory: "#FAF8F2",       // Warm ivory background
          orange: "#F97316",      // Burnt orange highlight
          mint: "#DDF3E8",        // Soft mint positive indicator
          minttext: "#0D6E48",
          slate: "#475569",       // Slate secondary
          border: "#E2E8F0",      // Border grey
          text: "#17212B",        // Main text
          muted: "#64748B",       // Muted text
          surface: "#FFFFFF",
        }
      },
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '"Inter"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif'
        ],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card': '0 1px 4px 0 rgba(0, 0, 0, 0.06), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'elevated': '0 4px 12px -2px rgba(18, 59, 54, 0.08), 0 2px 6px -2px rgba(18, 59, 54, 0.04)',
      },
      borderRadius: {
        'nest': '10px',
      }
    },
  },
  plugins: [],
}
