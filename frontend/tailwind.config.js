/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Wanda Gordon editorial system (primary)
        // Hierarchy: Ivory + Charcoal → Sage → Plum
        sage: {
          DEFAULT: '#C6D8AF',
          soft: '#DDE5D2',
        },
        plum: {
          DEFAULT: '#685369',
          deep: '#54445A',
          deeper: '#43364A',
          light: '#7A6480',
        },
        charcoal: '#111114',
        ivory: '#F7F5EF',
        // Warm editorial neutrals (Home + Events refinement).
        // NOTE: CED3DC (cool gray-blue) is deliberately NOT in the
        // palette — it fights the warm plum/sage/sand direction.
        // A neutral divider line, if ever needed, stays a future
        // option; do not implement one now.
        sand: '#DBD8B3',
        peach: '#FCC8B2',
        'warm-white': '#FCF7F8',
        obsidian: '#0B0B0D',
        navy: '#16141B',
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
          'radial-gradient(at 20% 20%, rgba(51,145,255,0.18) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(13,148,136,0.14) 0px, transparent 45%), radial-gradient(at 70% 80%, rgba(51,145,255,0.1) 0px, transparent 50%), linear-gradient(180deg, #f6f7f9 0%, #eef8ff 100%)',
        'mesh-dark':
          'radial-gradient(at 15% 20%, rgba(51,145,255,0.22) 0px, transparent 45%), radial-gradient(at 85% 15%, rgba(20,184,166,0.12) 0px, transparent 40%), radial-gradient(at 60% 85%, rgba(51,145,255,0.1) 0px, transparent 45%), linear-gradient(180deg, #0b1020 0%, #12182a 100%)',
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(20, 40, 80, 0.18)',
        glow: '0 0 0 1px rgba(51,145,255,0.15), 0 12px 40px -10px rgba(51,145,255,0.35)',
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
