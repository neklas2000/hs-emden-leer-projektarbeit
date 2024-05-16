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
      flex: {
        '1/2': '50%',
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
