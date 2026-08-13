import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [tailwindcss(), react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      strictPort: false,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:5000',
          changeOrigin: true,
          rewrite: (p) => p.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      sourcemap: mode !== 'production',
      rollupOptions: {
        output: {
          // manualChunks must be a function in Rollup
          manualChunks: (id) => {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) return 'vendor'
              if (id.includes('react-router-dom')) return 'router'
              if (id.includes('@tanstack/react-query')) return 'query'
              if (id.includes('framer-motion') || id.includes('lucide-react')) return 'ui'
            }
          },
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@tanstack/react-query',
        'zustand',
        'axios',
        'framer-motion',
      ],
    },
  }
})
