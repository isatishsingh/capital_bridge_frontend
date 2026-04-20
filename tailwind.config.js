/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07111F',
        canvas: '#F5F7FB',
        accent: '#0F766E',
        accentDark: '#115E59',
        signal: '#F97316',
        success: '#059669',
        danger: '#DC2626'
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 23, 42, 0.12)',
        panel: '0 12px 32px rgba(2, 8, 23, 0.08)'
      },
      backgroundImage: {
        'grid-fade':
          'linear-gradient(rgba(15,118,110,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.08) 1px, transparent 1px)'
      }
    }
  },
  plugins: []
};
