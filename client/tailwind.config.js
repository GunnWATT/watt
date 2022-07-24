module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: '#a51618',
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.54)',
        tertiary: 'rgba(0, 0, 0, 0.1)',
        content: 'white',
        'content-secondary': '#e9ecef',
        'sidebar': 'white',
        'background': '#f7f8fd',

        'theme-dark': '#ff594c',
        'primary-dark': 'white',
        'secondary-dark': 'rgba(255, 255, 255, 0.54)',
        'tertiary-dark': 'rgba(255, 255, 255, 0.1)',
        'content-dark': 'rgb(55, 55, 57)',
        'content-secondary-dark': 'rgb(42, 42, 44)',
        'sidebar-dark': 'rgb(25, 25, 27)',
        'background-dark': 'rgb(35, 35, 37)'
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
