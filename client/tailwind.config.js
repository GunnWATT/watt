module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: '#a51618',
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        tertiary: 'rgba(0, 0, 0, 0.1)',

        'theme-dark': '#ff594c',
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
