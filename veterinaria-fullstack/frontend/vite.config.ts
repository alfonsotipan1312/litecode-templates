import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/clients': { target: 'http://localhost:3001', changeOrigin: true },
      '/pets': { target: 'http://localhost:3001', changeOrigin: true },
      '/consultations': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})
