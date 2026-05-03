import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: './', // ВАЖНО для GitHub Pages и папок
  plugins: [react()],
})