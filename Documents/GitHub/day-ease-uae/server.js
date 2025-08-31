import express from 'express';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(compression());

const dist = path.join(__dirname, 'dist');
const pub = path.join(__dirname, 'public');

// Static for service worker/manifest
app.use(express.static(pub, { index: false }));
// Cache static assets aggressively except service worker and HTML
app.use((req, res, next) => {
  if (req.url.endsWith('.html') || req.url === '/' ) {
    res.setHeader('Cache-Control', 'no-cache');
  } else if (req.url === '/sw.js') {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Service-Worker-Allowed', '/');
  } else {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  }
  next();
});

// Serve built app
app.use(express.static(dist, { index: 'index.html' }));

// SPA fallback to dist/index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(dist, 'index.html'));
});

app.listen(port, () => {
  console.log(`DayEase server running on http://localhost:${port}`);
});
