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
  },
  plugins: [],
}
