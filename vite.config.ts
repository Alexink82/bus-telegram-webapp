import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    hmr: {
      // Обходим проблемы с WebSocket в контейнере
      clientPort: 443,
      protocol: 'wss'
    }
  }
})
