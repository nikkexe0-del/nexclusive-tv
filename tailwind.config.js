/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        display: ['"Inter"', '"SF Pro Display"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        // Stripe primaries
        primary:      '#533afd',
        'primary-deep': '#4434d4',
        'primary-press': '#2e2b8c',
        'primary-soft': '#665efd',
        'primary-muted': '#b9b9f9',
        // Surfaces
        'brand-dark': '#1c1e54',
        ink:          '#0d253d',
        'ink-2':      '#273951',
        'ink-mute':   '#64748d',
        canvas:       '#ffffff',
        'canvas-soft':'#f6f9fc',
        'canvas-cream':'#f5e9d4',
        hairline:     '#e3e8ee',
        'hairline-in':'#a8c3de',
        // Accents (gradient only)
        ruby:         '#ea2261',
        magenta:      '#f96bee',
        lemon:        '#9b6829',
      },
      letterSpacing: {
        'display-xxl': '-0.088em',
        'display-xl':  '-0.02em',
        'display-lg':  '-0.02em',
        'display-md':  '-0.01em',
        'tnum':        '-0.03em',
      },
      borderRadius: {
        pill: '9999px',
        'card': '12px',
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        'mesh-drift': 'meshDrift 12s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:   { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        meshDrift: { from: { transform: 'translate(0,0) scale(1)' }, to: { transform: 'translate(2%,1%) scale(1.04)' } },
      },
    },
  },
  plugins: [],
};
