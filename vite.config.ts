import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default {
  build: {
    entry: 'src/main.tsx',
    outDir: 'build'
  },
  base:"/carpool-frontend/",
  plugins: [react()]
}

