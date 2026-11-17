import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// O frontend chama /api/courses e o Vite encaminha para GET /courses do NestJS.
// Assim, o navegador não precisa lidar com CORS no ambiente de desenvolvimento.
const apiTarget = process.env.DEV_API_TARGET || 'http://127.0.0.1:3000';
const apiProxy = {
  '/api': {
    target: apiTarget,
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api(?=\/|$)/, ''),
  },
};

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: false, // se 5173 estiver ocupada, o Vite exibirá a porta escolhida
    proxy: apiProxy,
  },
  preview: { proxy: apiProxy }, // mantém /api/courses funcionando com npm run preview
});
