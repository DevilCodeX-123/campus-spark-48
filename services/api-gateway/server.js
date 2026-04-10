import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config({ path: '../../.env' });

const app = express();

// Trust proxy for production environments (Render/Vercel)
app.set('trust proxy', 1);

app.use(cors());

// Production Service URLs
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://localhost:3002';
const REG_SERVICE_URL = process.env.REG_SERVICE_URL || 'http://localhost:3003';

// Frontend URL for the welcome page link
const FRONTEND_URL = process.env.NODE_ENV === 'production' 
  ? 'https://college-connect-frontend.vercel.app' // This will be your Vercel URL
  : 'http://localhost:5173';

// Auth Service proxy
app.use('/api/auth', createProxyMiddleware({
  target: `${AUTH_SERVICE_URL}/auth`,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' },
  logLevel: 'debug'
}));

app.use('/api/owner', createProxyMiddleware({
  target: `${AUTH_SERVICE_URL}/owner`,
  changeOrigin: true,
  pathRewrite: { '^/api/owner': '' },
  logLevel: 'debug'
}));

// Event Service proxy
app.use('/api/events', createProxyMiddleware({
  target: `${EVENT_SERVICE_URL}/events`,
  changeOrigin: true,
  pathRewrite: { '^/api/events': '' },
  logLevel: 'debug'
}));

app.use('/api/budget', createProxyMiddleware({
  target: `${EVENT_SERVICE_URL}/budget`,
  changeOrigin: true,
  pathRewrite: { '^/api/budget': '' },
  logLevel: 'debug'
}));

// Registration Service proxy
app.use('/api/register', createProxyMiddleware({
  target: `${REG_SERVICE_URL}/register`,
  changeOrigin: true,
  pathRewrite: { '^/api/register': '' },
  logLevel: 'debug'
}));

app.get('/health', (req, res) => {
  res.json({ 
    status: 'API Gateway is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.send(`
    <style>
      body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; text-align: center; padding: 50px; background: #0f172a; color: white; }
      .container { max-width: 600px; margin: 0 auto; background: rgba(255,255,255,0.05); padding: 40px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.1); }
      h1 { color: #2dd4bf; margin-bottom: 10px; }
      p { color: #94a3b8; font-size: 1.1rem; }
      .link { display: inline-block; margin-top: 20px; padding: 12px 24px; background: #2dd4bf; color: #0f172a; text-decoration: none; border-radius: 10px; font-weight: bold; transition: all 0.2s; }
      .link:hover { transform: translateY(-2px); box-shadow: 0 10px 15px -3px rgba(45, 212, 191, 0.3); }
    </style>
    <div class="container">
      <h1>🚀 CampusConnect API Gateway</h1>
      <p>The backend services are healthy and running in <strong>${process.env.NODE_ENV || 'development'}</strong> mode.</p>
      <p>To access the application interface, please visit:</p>
      <a href="${FRONTEND_URL}" class="link">Go to Application UI</a>
    </div>
  `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
