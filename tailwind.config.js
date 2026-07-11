/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{njk,md,html,js}"],
  theme: {
    extend: {
      colors: {
        bg: "#E6C79A",
        "bg-grain": "#B98A54",
        card: "#F6EFDE",
        ink: "#2B2620",
        accent: "#C97B5A",
        "accent-sub": "#B08D57",
      },
      fontFamily: {
        display: ["'Shippori Mincho'", "serif"],
        body: ["'Zen Maru Gothic'", "sans-serif"],
        utility: ["'Noto Sans JP'", "sans-serif"],
      },
      borderRadius: {
        card: "14px",
      },
      height: {
        dvh: "100dvh",
      },
      minHeight: {
        dvh: "100dvh",
      },
    },
  },
  plugins: [],
};
