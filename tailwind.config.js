/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // DriveDeals Dark Luxury Automotive Design Tokens
        dd: {
          bg: '#090B0D',
          surface: '#111315',
          card: '#17191D',
          elevated: '#202328',
          red: '#ED1725',
          redDark: '#A30E18',
          textPrimary: '#FFFFFF',
          textSecondary: '#A1A1AA',
          textMuted: '#71717A',
          border: 'rgba(255, 255, 255, 0.10)',
          borderLight: 'rgba(255, 255, 255, 0.16)',
          success: '#22C55E',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#38BDF8',
        },

        // Reference Video Design Tokens (Updated to dark palette)
        palette: {
          bg: '#090B0D',
          surface: '#17191D',
          primary: '#FFFFFF',
          secondary: '#A1A1AA',
          dark: '#111315',
          green: '#22C55E',
          blue: '#38BDF8',
          orange: '#F59E0B',
          red: '#ED1725',
          border: 'rgba(255, 255, 255, 0.10)',
        },

        // MOTORCIRCLE Design Tokens aligned with reference
        charcoal: {
          DEFAULT: '#202421',
          900: '#171A19',
          800: '#202421',
          700: '#2C322E',
        },
        forest: {
          DEFAULT: '#171A19',
          900: '#171A19',
          800: '#1F2422',
          700: '#282F2C',
        },
        crimson: {
          DEFAULT: '#D85A4B',
          hover: '#C24D3F',
          dark: '#A83E32',
          light: '#FBF0EF',
          muted: '#F6E4E2',
        },
        warm: {
          DEFAULT: '#F5F5EF',
          50: '#FAF9F5',
          100: '#F5F5EF',
          200: '#EBEBE3',
          300: '#E1E1D6',
        },
        borderNeutral: '#E8EAE5',
        textSecondary: '#858A85',
        successGreen: {
          DEFAULT: '#168B6A',
          light: '#E8F5F1',
          dark: '#126E54',
        },
        accentBlue: {
          DEFAULT: '#327DBB',
          light: '#EBF4FA',
          dark: '#256396',
        },
        accentOrange: {
          DEFAULT: '#E8A93C',
          light: '#FDF6EB',
          dark: '#BD852A',
        },
        infoBg: '#EEF2EE',

        // Compatibility aliases mapped to new tokens
        brand: {
          50: '#FBF0EF',
          100: '#F6E4E2',
          200: '#ECC9C5',
          500: '#D85A4B',
          600: '#C24D3F',
          700: '#A83E32',
          800: '#8E3228',
          900: '#171A19',
        },
        navy: {
          800: '#202421',
          900: '#171A19',
          950: '#0F1211',
        },
        teal: {
          500: '#168B6A',
          600: '#168B6A',
          700: '#126E54',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        'card': '0 2px 8px rgba(0,0,0,0.04), 0 1px 3px rgba(0,0,0,0.02)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.03)',
        'modal': '0 20px 40px -15px rgba(0,0,0,0.15)',
      }
    },
  },
  plugins: [],
}
