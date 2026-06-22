import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/wangzhan/',   // GitHub Pages 部署路径
  server: {
    port: 5173,
    host: true,
  },
})
