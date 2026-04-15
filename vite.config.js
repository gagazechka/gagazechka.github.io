// import react from '@vitejs/plugin-react'
// import { defineConfig } from 'vite'

// // https://vite.dev/config/
// export default defineConfig({
//   logLevel: 'error', // Suppress warnings, only show errors
//   plugins: [react()]
// });

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  logLevel: 'error',
  plugins: [react()],
  resolve: {
    alias: {
      // Это связывает @ напрямую с папкой src
      '@': path.resolve(__dirname, './src'),
    },
  },
})