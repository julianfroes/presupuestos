import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base:"/presupuestos/",
  build: {
    outDir: 'dist', // Vite usa 'dist' en lugar de 'build'
    emptyOutDir: true,
  }
})
