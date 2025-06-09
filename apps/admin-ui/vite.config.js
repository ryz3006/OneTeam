import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This base path is critical for the Admin UI to work correctly
  base: '/OneTeam/Admin/', 
  plugins: [react()],
})
