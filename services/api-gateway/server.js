import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config({ path: '../../.env' });

const app = express();

// Trust proxy for production environments (Render/Vercel)
app.set('trust proxy', 1);

app.use(cors({
  origin: true,
  credentials: true
}));

// Dynamic Service URL Configuration
// If environment variables are provided (Multi-Server Deployment), it uses them.
// Otherwise, it safely defaults to internal localhost routing (Single-Server Monolith Deployment).
const getServiceUrl = (envVarName, defaultPort) => {
  if (process.env[envVarName]) {
    return process.env[envVarName]; // Use the Render URL if explicitly provided
  }
  return `http://localhost:${defaultPort}`; // Internal container routing
};

const AUTH_SERVICE_URL = getServiceUrl('AUTH_SERVICE_URL', 3001);
const EVENT_SERVICE_URL = getServiceUrl('EVENT_SERVICE_URL', 3002);
const REG_SERVICE_URL = getServiceUrl('REG_SERVICE_URL', 3003);
const AD_SERVICE_URL = getServiceUrl('AD_SERVICE_URL', 3004);

// Frontend URL for the welcome page link
const FRONTEND_URL = process.env.FRONTEND_URL || (process.env.NODE_ENV === 'production'
  ? 'https://collegeconnect-iota.vercel.app'
  : 'http://localhost:5173');

// Common Proxy Configuration for perfection
const proxyConfig = {
  changeOrigin: true,
  logLevel: 'debug',
  proxyTimeout: 30000,   // Wait 30s for service to respond
  onProxyReq: (proxyReq, req, res) => {
    // Keep internal headers for downstream traceability
    proxyReq.setHeader('X-Gateway-Request', 'true');
  },
  onError: (err, req, res) => {
    console.error(`❌ [GATEWAY PROXY ERROR] ${err.code} on ${req.url}`);
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(503).json({
      success: false,
      message: 'Service Temporarily Unavailable',
      service_status: req.url.split('/')[2],
      original_error: err.code
    });
  }
};

// Auth Service proxy
app.use('/api/auth', createProxyMiddleware({
  ...proxyConfig,
  target: `${AUTH_SERVICE_URL}/auth`,
  pathRewrite: { '^/api/auth': '' }
}));

app.use('/api/owner', createProxyMiddleware({
  ...proxyConfig,
  target: `${AUTH_SERVICE_URL}/owner`,
  pathRewrite: { '^/api/owner': '' }
}));

// Event Service proxy
app.use('/api/events', createProxyMiddleware({
  ...proxyConfig,
  target: `${EVENT_SERVICE_URL}/events`,
  pathRewrite: { '^/api/events': '' }
}));

app.use('/api/budget', createProxyMiddleware({
  ...proxyConfig,
  target: `${EVENT_SERVICE_URL}/budget`,
  pathRewrite: { '^/api/budget': '' }
}));

// Registration Service proxy
app.use('/api/register', createProxyMiddleware({
  ...proxyConfig,
  target: `${REG_SERVICE_URL}/register`,
  pathRewrite: { '^/api/register': '' }
}));

// Ad Service proxy
app.use('/api/ads', createProxyMiddleware({
  ...proxyConfig,
  target: `${AD_SERVICE_URL}/ads`,
  pathRewrite: { '^/api/ads': '' }
}));

app.get('/health', async (req, res) => {
  const services = [
    { name: 'Auth', url: AUTH_SERVICE_URL },
    { name: 'Event', url: EVENT_SERVICE_URL },
    { name: 'Registration', url: REG_SERVICE_URL },
    { name: 'Ads', url: AD_SERVICE_URL }
  ];

  const results = await Promise.all(services.map(async (s) => {
    try {
      const response = await fetch(`${s.url}/health`, { signal: AbortSignal.timeout(2000) });
      const data = await response.json();
      return { name: s.name, status: 'UP', detail: data };
    } catch (err) {
      return { name: s.name, status: 'DOWN', error: err.message };
    }
  }));

  const allClear = results.every(r => r.status === 'UP');

  res.json({
    status: allClear ? 'Healthy' : 'Degraded',
    gateway: 'UP',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    system_scan: results
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
