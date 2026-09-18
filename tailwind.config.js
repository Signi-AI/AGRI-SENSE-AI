/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: { sans: ['Inter', 'ui-sans-serif', 'system-ui'] },
      colors: {
        forest: '#173F2A',
        leaf: '#2F8F46',
        mint: '#EAF7ED',
        soil: '#7A563A',
        cream: '#F7FAF6'
      }
    }
  },
  plugins: []
}