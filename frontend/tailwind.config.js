// Token naming convention: evolutions/EVO-002_design-token-refactoring/token-convention.md
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          0: 'var(--paper-0)',
          1: 'var(--paper-1)',
          2: 'var(--paper-2)',
          3: 'var(--paper-3)',
        },
        ink: {
          1:  'var(--ink-1)',
          2:  'var(--ink-2)',
          3:  'var(--ink-3)',
          4:  'var(--ink-4)',
          5:  'var(--ink-5)',
          6:  'var(--ink-6)',
          7:  'var(--ink-7)',
          8:  'var(--ink-8)',
          9:  'var(--ink-9)',
          10: 'var(--ink-10)',
          11: 'var(--ink-11)',
          12: 'var(--ink-12)',
        },
        brass: {
          1:  'var(--brass-1)',
          2:  'var(--brass-2)',
          3:  'var(--brass-3)',
          4:  'var(--brass-4)',
          5:  'var(--brass-5)',
          6:  'var(--brass-6)',
          7:  'var(--brass-7)',
          8:  'var(--brass-8)',
          9:  'var(--brass-9)',
          10: 'var(--brass-10)',
          11: 'var(--brass-11)',
          12: 'var(--brass-12)',
        },
        sage: {
          1:  'var(--sage-1)',
          2:  'var(--sage-2)',
          3:  'var(--sage-3)',
          4:  'var(--sage-4)',
          5:  'var(--sage-5)',
          6:  'var(--sage-6)',
          7:  'var(--sage-7)',
          8:  'var(--sage-8)',
          9:  'var(--sage-9)',
          10: 'var(--sage-10)',
          11: 'var(--sage-11)',
          12: 'var(--sage-12)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        sans:    ['var(--font-sans)',    'sans-serif'],
        mono:    ['var(--font-mono)',    'monospace'],
      },
      letterSpacing: {
        widest: '0.18em',
      },
      opacity: {
        '88': '0.88',
      },
      borderRadius: {
        xs: '2px',
      },
      boxShadow: {
        menu: '0 1px 0 0 var(--ink-10), 0 8px 24px -12px rgba(14, 15, 12, 0.18)',
      },
    },
  },
  plugins: [],
}
