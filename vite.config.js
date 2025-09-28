// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const GRAFANA_URL = import.meta.env.VITE_GRAFANA_API_URL;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // '/api'로 시작하는 요청을 Grafana 서버로 전달
      '/api': {
        target: GRAFANA_URL,
        changeOrigin: true, // CORS를 위해 origin 헤더 변경
        secure: false,      // https가 아닌 http 서버에도 요청
      }
    }
  }
})