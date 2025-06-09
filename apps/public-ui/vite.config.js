// File: apps/public-ui/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // This MUST match your repository name
  base: '/OneTeam/', 
  plugins: [react()],
})
