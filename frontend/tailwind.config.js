/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        amz: {
          nav: '#0f172a',       // Deep midnight slate navbar
          subnav: '#1e293b',    // Secondary navigation strip
          accent: '#06b6d4',    // Vibrant Electric Cyan (distinct from Amazon orange)
          accentHover: '#0891b2',
          gold: '#f59e0b',      // Deal/Star amber
          bg: '#f1f5f9',        // Slate light marketplace body
          card: '#ffffff',      // Crisp white Amazon-style cards
          border: '#e2e8f0',    // Clean slate border
          text: '#0f172a',      // Primary dark slate text
          muted: '#64748b',     // Secondary slate text
          badge: '#0ea5e9',     // Prime/Deal blue
        }
      }
    },
  },
  plugins: [],
}
