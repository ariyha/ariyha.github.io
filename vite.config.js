import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // For GitHub Pages project site (https://ariyha.github.io/portfolio)
  base: '/portfolio/',
  plugins: [react()],
  build: {
    // gh-pages script in package.json expects a `build` folder
    outDir: 'build'
  },
  server: {
    port: 5173,
    host: true
  }
})