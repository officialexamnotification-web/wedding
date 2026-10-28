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
  'jyotish',
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
    // The largest remaining chunks are lazy-loaded SVG/3D libraries whose gzip sizes
    // are small; keep the warning focused on chunks above 800 kB after minification.
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/stickers.ts')) return 'sticker-library';
          if (id.includes('/src/data/elements/mediaInteractiveManifest.ts')) return 'media-library';
          if (id.includes('/src/data/templates.ts')) return 'invitation-templates';
          if (id.includes('/src/data/shlokaLibrary.ts')) return 'shloka-library';
          if (id.includes('/src/components/ElementsLibraryPanel.tsx')) return 'elements-library';
          if (id.includes('/src/data/elements/graphicsManifest.ts')) return 'element-graphics';
          if (id.includes('/src/data/elements/canvaDecorativeManifest.ts')) return 'element-decorative';
          if (id.includes('/src/data/elements/shapesManifest.ts')) return 'element-shapes';
          if (id.includes('/src/data/elements/framesGridsManifest.ts')) return 'element-frames';
          if (id.includes('/src/data/elements/premiumWedding.ts')) return 'element-wedding-art';
        },
      },
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});
