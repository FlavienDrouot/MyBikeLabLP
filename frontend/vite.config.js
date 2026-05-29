import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/MyBikeLabLP/',
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
    alias: [
      {
        find: /^.+\.(svg|png|jpg|jpeg|gif)$/,
        replacement: fileURLToPath(new URL('./src/__mocks__/fileMock.js', import.meta.url)),
      },
    ],
  },
})
