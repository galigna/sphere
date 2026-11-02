import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  base: '/sphere/',
  plugins: [react()],
  // three + R3F are one lazy chunk by design.
  build: { chunkSizeWarningLimit: 1000 },
})
