import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import catalogHandler from './api/catalog.js';
import adminCatalogHandler from './api/admin/catalog.js';
import adminLoginHandler from './api/admin/login.js';
import adminLogoutHandler from './api/admin/logout.js';
import adminSessionHandler from './api/admin/session.js';
import adminUploadHandler from './api/admin/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '256kb' }));

  // Card Studio catalog and secured admin endpoints use the same handlers as
  // the deployment's serverless API routes, so local and deployed behavior match.
  app.all('/api/catalog', async (req, res) => { await catalogHandler(req, res); });
  app.all('/api/admin/catalog', async (req, res) => { await adminCatalogHandler(req, res); });
  app.all('/api/admin/login', async (req, res) => { await adminLoginHandler(req, res); });
  app.all('/api/admin/logout', async (req, res) => { await adminLogoutHandler(req, res); });
  app.all('/api/admin/session', async (req, res) => { await adminSessionHandler(req, res); });
  app.all('/api/admin/upload', async (req, res) => { await adminUploadHandler(req, res); });

  if (IS_PROD) {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get(['/card-studio/admin', '/card-studio/admin/*', '/card-studio/jyotish-studio', '/card-studio/jyotish-studio/*'], (_req, res) => {
      res.sendFile(path.join(distDir, 'card-studio', 'index.html'));
    });
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use((req, _res, next) => {
      const [pathname, query] = (req.url || '').split('?');
      if (/^\/card-studio\/(?:admin|jyotish-studio)(?:\/.*)?\/?$/.test(pathname)) {
        req.url = `/card-studio/index.html${query ? `?${query}` : ''}`;
      }
      next();
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
