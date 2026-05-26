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
        brand: {
          // RETIRED — kept to avoid build warnings; do not use in components
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          900: '#0b1d3a',
        },
        paper: {
          0: '#fbfaf6',
          1: '#f6f4ef',
          2: '#efebe2',
          3: '#e6e0d2',
        },
        ink: {
          1:  '#efede2',
          2:  '#e4e2d6',
          3:  '#d6d4c7',
          4:  '#c2c0b3',
          5:  '#a7a69b',
          6:  '#8a8980',
          7:  '#6e6d65',
          8:  '#555550',
          9:  '#3a3a35',
          10: '#2a2a26',
          11: '#1a1a17',
          12: '#0e0f0c',
        },
        brass: {
          1:  '#fcf8ef',
          2:  '#f8f1e4',
          3:  '#f3ead8',
          4:  '#ecdec2',
          5:  '#e2cea4',
          6:  '#d6bb87',
          7:  '#c9a86a',
          8:  '#a88846',
          9:  '#8c6e35',
          10: '#6b5328',
          11: '#4a3a1f',
          12: '#2a2014',
        },
        sage: {
          1:  '#eef0ea',
          2:  '#e2e5dc',
          3:  '#d2d6cb',
          4:  '#bbc1b4',
          5:  '#a0a797',
          6:  '#858d7c',
          7:  '#6b7361',
          8:  '#525c54',
          9:  '#3e4742',
          10: '#2d3530',
          11: '#1f2522',
          12: '#14181a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'SF Mono', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
