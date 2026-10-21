import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const staticSitePages = new Set([
  'about',
  'contact',
  'privacy',
  'terms',
  'wedding-invitations',
  'griha-pravesh-invitations',
  'sangeet-haldi-invitations',
  'birthday-invitations',
  'godh-bharai-invitations',
  'anniversary-invitations',
]);

const staticPageDirectoryIndex = {
  name: 'static-page-directory-index',
  configureServer(server) {
    server.middlewares.use((req, _res, next) => {
      const pathname = req.url?.split('?')[0] ?? '';
      const match = pathname.match(/^\/([a-z0-9-]+)\/$/);
      if (match && staticSitePages.has(match[1])) {
        req.url = `${pathname}index.html${req.url.slice(pathname.length)}`;
      }
      next();
    });
  },
};

export default defineConfig({
  plugins: [staticPageDirectoryIndex, react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
