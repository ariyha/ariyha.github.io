import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // For GitHub Pages user site (https://ariyha.github.io) - build assets should use root base
  base: '/',
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  }
})