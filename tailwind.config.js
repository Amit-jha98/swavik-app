/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#030303',
          900: '#070707',
          850: '#0b0a08',
          800: '#11100d'
        },
        gold: {
          50: '#fff8db',
          100: '#f9e9a7',
          300: '#e6c75e',
          500: '#d4af37',
          700: '#9b7722',
          900: '#4d3512'
        },
        cream: {
          50: '#fbf5e6',
          100: '#eee0c0',
          300: '#cdbb91'
        },
        rosewood: '#4b1f28',
        smoke: '#8b8580'
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Cinzel', 'Cormorant Garamond', 'serif']
      },
      boxShadow: {
        aureate: '0 24px 80px rgba(212, 175, 55, 0.16)',
        velvet: '0 30px 100px rgba(0, 0, 0, 0.55)'
      },
      backgroundImage: {
        'gold-foil': 'linear-gradient(135deg, #fff8db 0%, #d4af37 42%, #8f651d 100%)',
        'obsidian-radial': 'radial-gradient(circle at 50% 0%, rgba(212,175,55,0.16), transparent 32%), linear-gradient(180deg, #070707 0%, #030303 100%)'
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.19, 1, 0.22, 1)'
      }
    }
  },
  plugins: []
};
