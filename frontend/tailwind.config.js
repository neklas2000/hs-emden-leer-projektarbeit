/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      maxWidth: {
        'inherit': 'inherit',
        '3/4': '75%',
      },
      minHeight: {
        '50': '12.5rem',
      },
      maxHeight: {
        '125': '31.25rem',
      },
      flex: {
        '1/2': '50%',
        'fit': 'fit-content',
      },
    },
    screens: {
      'gt-lg': { min: '1920px' },
      'lt-lg': { max: '1919.99px' },
      'gt-md': { min: '1280px' },
      'lt-md': { max: '1279.99px' },
      'gt-sm': { min: '960px' },
      'lt-sm': { max: '959.99px' },
      'gt-xs': { min: '600px' },
      'lt-xs': { max: '599.99px' },
    },
  },
  plugins: [],
}
