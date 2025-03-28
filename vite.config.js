import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import path from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
    }),
    // vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    proxy: {
      '/api': {//获取路径中包含/api的请求
        target: 'http://127.0.0.1:8080',  //获取后台所在的源
        changeOrigin: true,  //修改源
        rewrite: (path) => path.replace(/^\/api/, '')  // 将/api替换为空字符串
      }
    },
    allowedHosts: [
      'frp-act.com'
    ]
  }
})
