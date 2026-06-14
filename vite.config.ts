import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // El sitio se publica en https://thjuank.github.io/onda-lab/ (project site),
  // por eso los assets deben resolverse bajo /onda-lab/ y no en la raíz.
  base: '/onda-lab/',
  plugins: [react()],
})
