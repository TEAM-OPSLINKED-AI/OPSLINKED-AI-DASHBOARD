import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // 현재 작업 디렉토리의 .env 파일을 process.env 객체로 로드합니다.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/spring': {
          target: env.VITE_SPRING_EXPORTER_URL, // process.env에서 값을 읽어옵니다.
          changeOrigin: true,
          secure: false,      // https가 아닌 http 서버에도 요청
          rewrite: (path) => path.replace(/^\/api\/spring/, ''),
        },
        '/api/mysql': {
          target: env.VITE_MYSQL_EXPORTER_URL, // process.env에서 값을 읽어옵니다.
          changeOrigin: true,
          secure: false,      // https가 아닌 http 서버에도 요청
          rewrite: (path) => path.replace(/^\/api\/mysql/, ''),
        },
        '/api/grafana': {
          target: env.VITE_GRAFANA_API_URL, // process.env에서 값을 읽어옵니다.
          changeOrigin: true,
          secure: false,      // https가 아닌 http 서버에도 요청
          rewrite: (path) => path.replace(/^\/api\/grafana/, ''),
        }
      }
    }
  };
});