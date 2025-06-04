/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F9F5F5',
          100: '#F2E5E5',
          200: '#E6CCCC',
          300: '#D9B3B3',
          400: '#C99999',
          500: '#B98080',
          600: '#8B0000', // Dark Red (Burgundy)
          700: '#7A0000',
          800: '#690000',
          900: '#580000',
        },
        secondary: {
          50: '#FDF9EC',
          100: '#FBF3D8',
          200: '#F7E7B2',
          300: '#F3DB8B',
          400: '#EFCF65',
          500: '#DAA520', // Gold
          600: '#C3941D',
          700: '#AC8319',
          800: '#946016',
          900: '#7D5212',
        },
        accent: {
          50: '#EBF5F0',
          100: '#D7EBE1',
          200: '#AFD7C3',
          300: '#87C3A5',
          400: '#5FAF87',
          500: '#2E8B57', // Sea Green
          600: '#297C4E',
          700: '#246E45',
          800: '#1F5F3C',
          900: '#1A5133',
        },
        success: {
          500: '#10B981',
        },
        warning: {
          500: '#F59E0B',
        },
        error: {
          500: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      spacing: {
        '128': '32rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};