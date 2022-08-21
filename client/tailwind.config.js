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
        primary: 'rgb(var(--primary))', // NOTE: `primary`, `secondary`, and `tertiary` do *not* work with opacity modifiers.
        secondary: 'rgb(var(--secondary))',
        tertiary: 'rgb(var(--tertiary))',
        content: 'rgb(var(--content) / <alpha-value>)',
        'content-secondary': 'rgb(var(--content-secondary) / <alpha-value>)',
        sidebar: 'rgb(var(--sidebar) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
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
