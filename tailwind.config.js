/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm paper background
        paper: {
          50: '#FFFDFB',
          100: '#FFFBF5',
          200: '#FFF7ED',
          300: '#FEF3E2',
          400: '#FCE8C8',
        },
        // Bold primary - Coral/Salmon
        coral: {
          300: '#FFA8A8',
          400: '#FF8585',
          500: '#FF6B6B',
          600: '#FA5252',
          700: '#E03131',
        },
        // Deep teal for contrast
        teal: {
          400: '#3D7A8C',
          500: '#2D6A7A',
          600: '#2D4A5E',
          700: '#1D3A4E',
          800: '#0D2A3E',
          900: '#051A2E',
        },
        // Electric lime accent
        lime: {
          300: '#D4FF70',
          400: '#BEFF3A',
          500: '#A8E600',
        },
        // Warm shadows
        shadow: {
          light: 'rgba(45, 74, 94, 0.08)',
          medium: 'rgba(45, 74, 94, 0.15)',
          dark: 'rgba(45, 74, 94, 0.25)',
        },
        // Text colors
        ink: {
          900: '#1A1A2E',
          800: '#2D2D44',
          700: '#3D3D5C',
          600: '#5C5C7A',
          500: '#7A7A99',
          400: '#9999B3',
          300: '#B3B3CC',
        },
      },
      fontFamily: {
        display: ['Syne', 'system-ui', 'sans-serif'],
        body: ['Outfit', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-lg': ['3rem', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '700' }],
        'display-sm': ['1.5rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      boxShadow: {
        'brutal-sm': '3px 3px 0px 0px rgba(45, 74, 94, 0.2)',
        'brutal': '4px 4px 0px 0px rgba(45, 74, 94, 0.25)',
        'brutal-lg': '6px 6px 0px 0px rgba(45, 74, 94, 0.3)',
        'brutal-xl': '8px 8px 0px 0px rgba(45, 74, 94, 0.35)',
        'brutal-coral': '4px 4px 0px 0px #FF6B6B',
        'brutal-teal': '4px 4px 0px 0px #2D4A5E',
        'brutal-lime': '4px 4px 0px 0px #BEFF3A',
        'soft': '0 4px 20px rgba(45, 74, 94, 0.08)',
        'soft-lg': '0 8px 40px rgba(45, 74, 94, 0.12)',
        'glow-coral': '0 0 30px rgba(255, 107, 107, 0.4)',
        'glow-lime': '0 0 30px rgba(190, 255, 58, 0.4)',
        'inner-soft': 'inset 0 2px 4px rgba(45, 74, 94, 0.06)',
      },
      borderRadius: {
        'brutal': '16px',
        'brutal-lg': '24px',
        'brutal-xl': '32px',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      animation: {
        'bounce-in': 'bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'bounce-subtle': 'bounce-subtle 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'pop': 'pop 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
        'number-float': 'number-float 0.8s ease-out forwards',
      },
      keyframes: {
        'bounce-in': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'pulse-soft': {
          '0%, 100%': { transform: 'scale(1)', opacity: '1' },
          '50%': { transform: 'scale(1.02)', opacity: '0.9' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'pop': {
          '0%': { transform: 'scale(0.95)' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateY(-5px) rotate(1deg)' },
          '75%': { transform: 'translateY(-3px) rotate(-1deg)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'number-float': {
          '0%': { transform: 'translateY(0) scale(1)', opacity: '1' },
          '100%': { transform: 'translateY(-50px) scale(1.2)', opacity: '0' },
        },
      },
      backgroundImage: {
        'paper-texture': `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
        'grid-pattern': `
          linear-gradient(rgba(45, 74, 94, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(45, 74, 94, 0.03) 1px, transparent 1px)
        `,
        'dots-pattern': `radial-gradient(rgba(45, 74, 94, 0.1) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
        'dots': '20px 20px',
      },
    },
  },
  plugins: [],
}
