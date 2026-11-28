import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'node:url';
import {defineConfig, type Plugin} from 'vite';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const cardStudioRouteFallback: Plugin = {
  name: 'card-studio-route-fallback',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const requestUrl = req.url || '';
      const [pathname, query] = requestUrl.split('?');
      if (/^\/card-studio\/?$/.test(pathname)) {
        req.url = `/card-studio/index.html${query ? `?${query}` : ''}`;
      }
      if (/^\/card-studio\/(?:admin|jyotish-studio)(?:\/.*)?\/?$/.test(pathname)) {
        req.url = `/card-studio/index.html${query ? `?${query}` : ''}`;
      }
      next();
    });
  },
};

export default defineConfig(() => {
  return {
    plugins: [cardStudioRouteFallback, react(), tailwindcss()],
    publicDir: path.resolve(projectRoot, 'card-studio/public'),
    resolve: {
      alias: {
        '@': projectRoot,
      },
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(projectRoot, 'index.html'),
          cardStudio: path.resolve(projectRoot, 'card-studio/index.html'),
        },
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
