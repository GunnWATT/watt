module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          DEFAULT: '#a51618',
          dark: '#ff594c'
        },
        primary: {
          DEFAULT: 'rgba(0, 0, 0, 0.87)',
          dark: 'white'
        },
        secondary: {
          DEFAULT: 'rgba(0, 0, 0, 0.54)',
          dark: 'rgba(255, 255, 255, 0.54)'
        },
        tertiary: {
          DEFAULT: 'rgba(0, 0, 0, 0.1)',
          dark: 'rgba(255, 255, 255, 0.1)'
        },
        content: {
          DEFAULT: 'white',
          dark: 'rgb(55, 55, 57)'
        },
        'content-secondary': {
          DEFAULT: '#e9ecef',
          dark: 'rgb(42, 42, 44)'
        },
        sidebar: {
          DEFAULT: 'white',
          dark: 'rgb(25, 25, 27)'
        },
        background: {
          DEFAULT: '#f7f8fd',
          dark: 'rgb(35, 35, 37)'
        }
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
