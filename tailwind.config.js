export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: { extend: {
    fontFamily: { display: ['"Bricolage Grotesque"', 'sans-serif'], sans: ['Figtree', 'system-ui', 'sans-serif'] },
    colors: {
      lagoon: { 50: '#ecf8f6', 500: '#14a39a', 600: '#0e857e', 700: '#0c6b66', 900: '#0b2b35' },
      sun: { 400: '#f6b94a', 500: '#f2a93b' },
      night: { 900: '#07161c', 800: '#0d222a', 700: '#14303a' },
    },
    keyframes: { pop: { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.3)' } }, rise: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'none' } } },
    animation: { pop: 'pop .3s ease', rise: 'rise .25s ease' },
  } },
  plugins: [],
};
