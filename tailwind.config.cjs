module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ds: {
          900: '#050505',
          800: '#111111',
          700: '#1C1C1C',
          red: '#FF0000',
          'red-dark': '#D90000',
          100: '#ECECEC'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif']
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem'
      },
      borderRadius: {
        sm: '6px',
        md: '10px',
        lg: '14px',
        xl: '18px'
      },
      boxShadow: {
        'elev-1': '0 6px 18px rgba(0,0,0,0.6)',
        'elev-2': '0 12px 40px rgba(0,0,0,0.65)',
        glow: '0 6px 30px rgba(217,0,0,0.18), 0 0 40px rgba(255,0,0,0.06)'
      },
      backdropBlur: {
        xs: '4px',
        md: '10px'
      },
      transitionDuration: {
        250: '250ms'
      }
    }
  },
  plugins: []
}
