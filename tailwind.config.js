/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base Neutrals
        bone: "#EFECE4",
        "butcher-paper": "#F6F3EC",
        "cast-iron": "#2F2A24",
        "outline-gray": "#BDB6A9",
        "text-charcoal": "#3C3C3A",
        "helper-text": "#6F6D65",

        // Accent Colors
        "olive-oil-gold": "#C5A75A",
        "herb-green": "#5F6B3C",
        "paprika-red": "#A6452E",
        "egg-yolk": "#D9A24A",

        // Additional UI colors
        steam: "#F5F5F2",
      },
      fontFamily: {
        spectral: ["Spectral", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      fontSize: {
        logo: ["2rem", { lineHeight: "1.2", fontWeight: "500" }],
        heading: ["1.5rem", { lineHeight: "1.3", fontWeight: "500" }],
        subheading: ["1.125rem", { lineHeight: "1.4", fontWeight: "500" }],
        body: ["1rem", { lineHeight: "1.5", fontWeight: "400" }],
        chip: ["0.875rem", { lineHeight: "1.4", fontWeight: "500" }],
        helper: ["0.8125rem", { lineHeight: "1.4", fontWeight: "400" }],
      },
      borderRadius: {
        mise: "12px",
        chip: "24px",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      boxShadow: {
        mise: "0 2px 8px rgba(60, 60, 58, 0.08)",
        "mise-inset": "inset 0 1px 3px rgba(60, 60, 58, 0.08)",
      },
      animation: {
        "fade-up": "fadeUp 0.3s ease-out",
        "spin-slow": "spin 2s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
