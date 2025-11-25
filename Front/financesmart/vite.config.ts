import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,       // <--- O segredo! Libera acesso externo
    port: 5173,       // Garante a porta 5173
    strictPort: true,
    watch: {
      usePolling: true, // Garante que o Hot Reload funcione no Linux
    }
  }
})
