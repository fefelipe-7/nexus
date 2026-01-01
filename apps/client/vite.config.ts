import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@nexus/core': path.resolve(__dirname, '../../packages/core/src'),
      '@nexus/shared': path.resolve(__dirname, '../../packages/shared/src'),
    },
  },
  server: {
    strictPort: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5183,
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
