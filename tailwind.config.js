/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          primary: "#1f3a47",
          secondary: "#f0f0f0",
          accent: "#3e8989",
        },
        typography: {
          DEFAULT: {
            css: {
              maxWidth: '65ch',
              color: '#333',
              a: {
                color: '#3e8989',
                '&:hover': {
                  color: '#2c6363',
                },
              },
              h2: {
                fontWeight: '700',
                marginTop: '2em',
              },
              code: {
                backgroundColor: '#f5f5f5',
                padding: '0.2em 0.4em',
                borderRadius: '3px',
              },
            },
          },
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }