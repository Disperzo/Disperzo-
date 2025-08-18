/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        copperx: {
          50: '#fef7f0',
          100: '#fdecd8',
          200: '#fbd5b0',
          300: '#f8b87d',
          400: '#f59347',
          500: '#f2751a',
          600: '#e35a0f',
          700: '#bc4310',
          800: '#963514',
          900: '#792e14',
          950: '#411507',
        },
        dark: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
          950: '#0a0a0a',
        }
      },
      backgroundImage: {
        'copperx-gradient': 'linear-gradient(135deg, #f2751a 0%, #e35a0f 50%, #bc4310 100%)',
        'copperx-radial': 'radial-gradient(ellipse at center, #f2751a 0%, #e35a0f 50%, #bc4310 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 25%, #2d2d2d 50%, #1a1a1a 75%, #0a0a0a 100%)',
      },
      animation: {
        'copperx-pulse': 'copperx-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'copperx-bounce': 'copperx-bounce 1s infinite',
        'copperx-shimmer': 'copperx-shimmer 2s linear infinite',
      },
      keyframes: {
        'copperx-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
        'copperx-bounce': {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' },
        },
        'copperx-shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
    },
  },
  plugins: [],
};
