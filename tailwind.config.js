/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'scanning': 'scanning 3s linear infinite',
        'thinking': 'thinking 2s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glowing 2s ease-in-out infinite',
        'processing': 'processing-glow 2s ease-in-out infinite',
        'rotate-scale': 'rotate-scale 4s linear infinite',
        'quote-animation': 'quote-fade 5s ease-in-out infinite',
        'progressAnimation': 'progressAnimation 1.5s ease-out',
      },
      scale: {
        '102': '1.02',
      }
    },
  },
  plugins: [],
  safelist: [
    {
      pattern: /(bg|text)-(red|yellow|green|blue)-(100|500|800)/,
    },
    {
      pattern: /animate-(pulse|ping|bounce|spin)/,
    },
    'scale-102',
    'hover:scale-102',
  ],
}