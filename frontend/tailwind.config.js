/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Wanda Gordon financial system (primary)
        // Hierarchy: Ivory + Charcoal → Gold → Navy
        // Token names (sage/plum) are kept so all public sections
        // update without touching every component — values below are
        // navy + gold for a financial educator brand.
        sage: {
          DEFAULT: '#C9A24B',
          soft: '#EDE3C8',
        },
        plum: {
          DEFAULT: '#142C4F',
          deep: '#0F2340',
          deeper: '#0A1B33',
          light: '#2C4E7E',
        },
        charcoal: '#111114',
        ivory: '#F7F5EF',
        // Warm financial neutrals (Home + Events refinement).
        // Champagne-tinted sand pairs with gold accents on ivory.
        sand: '#E2D6B8',
        peach: '#E6C87A',
        'warm-white': '#FCF7F8',
        obsidian: '#0B0B0D',
        navy: '#0A1B33',
        // Legacy accent — public site no longer references these;
        // .site-footer carries its own scoped copies so it stays identical.
        gold: {
          DEFAULT: '#C9A24D',
          dark: '#A58133',
          light: '#E6D3A3',
        },
        champagne: '#E6D3A3',
        muted: '#8E9299',
        // Legacy tokens — kept temporarily so existing
        // Gasper-portfolio components keep rendering during
        // the phased rebrand. Removed in final cleanup pass.
        brand: {
          50: '#eef8ff',
          100: '#d9eeff',
          200: '#bce2ff',
          300: '#8ed0ff',
          400: '#59b4ff',
          500: '#3391ff',
          600: '#1a6ff5',
          700: '#1458e1',
          800: '#1747b6',
          900: '#193e8f',
          950: '#142757',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5dae3',
          300: '#b0b9c9',
          400: '#8593ab',
          500: '#667690',
          600: '#515e76',
          700: '#434d60',
          800: '#3a4251',
          900: '#343946',
          950: '#22262f',
        },
        accent: {
          DEFAULT: '#0d9488',
          light: '#14b8a6',
          dark: '#0f766e',
        },
      },
      fontFamily: {
        // Wanda editorial type (primary)
        serif: ['"Playfair Display"', '"DM Serif Display"', 'Georgia', 'serif'],
        sans: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
        // Legacy aliases — display/sans resolve to Wanda fonts so
        // existing `font-display` classes pick up the new look
        // without touching every component in Phase 2.
        display: ['"Playfair Display"', '"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      transitionTimingFunction: {
        luxury: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      backgroundImage: {
        'mesh-light':
          'radial-gradient(at 20% 20%, rgba(201,162,77,0.16) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(20,44,79,0.10) 0px, transparent 45%), radial-gradient(at 70% 80%, rgba(201,162,77,0.10) 0px, transparent 50%), linear-gradient(180deg, #F7F5EF 0%, #EDE3C8 100%)',
        'mesh-dark':
          'radial-gradient(at 15% 20%, rgba(201,162,77,0.20) 0px, transparent 45%), radial-gradient(at 85% 15%, rgba(201,162,77,0.10) 0px, transparent 40%), radial-gradient(at 60% 85%, rgba(20,44,79,0.35) 0px, transparent 45%), linear-gradient(180deg, #0A1B33 0%, #0F2340 100%)',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(10, 27, 51, 0.28)',
        glow: '0 0 0 1px rgba(201,162,77,0.22), 0 12px 40px -10px rgba(201,162,77,0.35)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
      },
    },
  },
  plugins: [],
};
