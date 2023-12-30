import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
// import mkcert from 'vite-plugin-mkcert';

const localhostAddress = 'http://127.0.0.1:9000';

const config = defineConfig({
  plugins: [
    react(),
    // mkcert(),
  ],
  define: {
    global: {},
  },
  server: {
    // this ensures that the browser opens upon server start
    open: true,
    // this sets a default port to 3000  
    port: 5173,
    proxy: {
      '/test-x': {
        ws: true,
        target: localhostAddress,
        changeOrigin: true,
        secure: false,
        // rewrite: (path) => path.replace(/^\/test-x/, ''),
      },
    }
  },
})

export default config
