module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: 'rgb(var(--theme) / <alpha-value>)',
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        tertiary: 'rgba(0, 0, 0, 0.1)',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-secondary': 'rgb(var(--content-secondary) / <alpha-value>)',
        sidebar: 'rgb(var(--sidebar) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',

        'primary-dark': 'white',
        'secondary-dark': 'rgba(255, 255, 255, 0.54)',
        'tertiary-dark': 'rgba(255, 255, 255, 0.1)',
      }
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      }
    }
  },
  plugins: [],
}
