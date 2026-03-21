import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/clients': { target: 'http://localhost:3001', changeOrigin: true },
      '/pets': { target: 'http://localhost:3001', changeOrigin: true },
      '/consultations': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
})
