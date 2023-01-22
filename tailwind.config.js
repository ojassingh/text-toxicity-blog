/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Note the addition of the `app` directory.
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        one: "#032326",
        two: "#255459",
        three: "#177373",
        four: "#F27777",
        five: "#D98B8B",
        back: "#262625",
        chalk: '#F2F2F2',
        gray: "#A6A6A6",
        faintblue: "#495B73"
      },
      fontSize: {
        '6xl': '3.5rem'
      }
    },
  },
  plugins: ["tailwindcss", "postcss-preset-env"],
}
