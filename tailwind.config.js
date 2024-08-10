/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        'xxs': '0.370rem',
      },
      boxShadow: {
        white: '0 0 10px 5px rgba(255, 255, 255, 0.1)',
        hero: 'inset 0 0 80px rgba(0, 0, 0, 0.8)' // Ajusta el tamaño y color según sea necesario  
      },
      animation: {
        pulse1: 'pulse 2s infinite ease-in-out -0.8s',
        pulse2: 'pulse 2s infinite ease-in-out -0.6s',
        pulse3: 'pulse 2s infinite ease-in-out -0.4s',
        pulse4: 'pulse 2s infinite ease-in-out -0.2s',
        pulse5: 'pulse 2s infinite ease-in-out 0s',
      },
      keyframes: {
        pulse: {
          '0%': {
            transform: 'scale(0.8)',
            backgroundColor: '#EA3324',
            boxShadow: '0 0 0 0 rgba(234, 51, 36, 0.7)',
          },
          '50%': {
            transform: 'scale(1.1)',
            backgroundColor: '#B21C18',
            boxShadow: '0 0 0 6px rgba(234, 51, 36, 0)',
          },
          '100%': {
            transform: 'scale(0.8)',
            backgroundColor: '#EA3324',
            boxShadow: '0 0 0 0 rgba(234, 51, 36, 0.7)',
          },
        },
      },
      colors: {
        primary: "#00040f", // Your primary background color
        secondary: "#00f6ff", // Your secondary accent color
        dimWhite: "rgba(255, 255, 255, 0.7)", // A dimmed white color
        dimBlue: "rgba(9, 151, 124, 0.1)", // A dimmed blue color
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"], // Use the Poppins font family
      },
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1060px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
};
