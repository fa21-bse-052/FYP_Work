module.exports = {
  content: [
    "./index.html",  // Include HTML files
    "./src/**/*.{js,jsx}",  // Include JS/JSX files
  ],
  theme: {
    extend: {
      fontFamily: {
        audrey: ['Audrey'], // Add Audrey font
      },
      animation: {
        fadeIn: "fadeIn 2s ease-in-out", // Custom animations
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};
