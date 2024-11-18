import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  //api路径代理
  server: {
    host: 'localhost',
    port: 1234,
    proxy: {
      '/api': 'http://api-driver.marsview.cc' //跨域代理
    }
  },

  publicDir: 'public',
  //路径重写 ./.. => @
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
