import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config({ path: '../../.env' });

const app = express();

app.use(cors());

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:3001';
const EVENT_SERVICE_URL = process.env.EVENT_SERVICE_URL || 'http://localhost:3002';
const REG_SERVICE_URL = process.env.REG_SERVICE_URL || 'http://localhost:3003';

// Auth Service proxy
app.use('/api/auth', createProxyMiddleware({
  target: `${AUTH_SERVICE_URL}/auth`,
  changeOrigin: true,
  pathRewrite: { '^/api/auth': '' }
}));

app.use('/api/owner', createProxyMiddleware({
  target: `${AUTH_SERVICE_URL}/owner`,
  changeOrigin: true,
  pathRewrite: { '^/api/owner': '' }
}));

// Event Service proxy
app.use('/api/events', createProxyMiddleware({
  target: `${EVENT_SERVICE_URL}/events`,
  changeOrigin: true,
  pathRewrite: { '^/api/events': '' }
}));

app.use('/api/budget', createProxyMiddleware({
  target: `${EVENT_SERVICE_URL}/budget`,
  changeOrigin: true,
  pathRewrite: { '^/api/budget': '' }
}));

// Registration Service proxy
app.use('/api/register', createProxyMiddleware({
  target: `${REG_SERVICE_URL}/register`,
  changeOrigin: true,
  pathRewrite: { '^/api/register': '' }
}));

app.get('/health', (req, res) => {
  res.json({ status: 'API Gateway is running' });
});

app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding: 50px;">
      <h1>🚀 CampusConnect API Gateway</h1>
      <p>This is the backend gateway. To access the User Interface, please visit:</p>
      <a href="http://localhost:5173" style="font-size: 20px; color: #0d9488; font-weight: bold;">http://localhost:5173</a>
    </div>
  `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`API Gateway running on port ${PORT}`));
