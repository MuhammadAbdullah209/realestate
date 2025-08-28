import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/Api': {   // 👈 no trailing slash
        target: 'http://localhost:8000',
        changeOrigin: true, // optional but recommended
        secure: false,
      },
    },
  },
  plugins: [react()],
})