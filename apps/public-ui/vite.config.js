import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // This base path should be the name of your GitHub repository.
  base: '/6d-ops-oneteam/', 
  plugins: [react()],
})
