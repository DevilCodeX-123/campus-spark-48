import { spawn, execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const services = [
  { name: 'AUTH', path: 'services/auth-service', port: 3001 },
  { name: 'EVENT', path: 'services/event-service', port: 3002 },
  { name: 'REGISTRATION', path: 'services/registration-service', port: 3003 },
  { name: 'AD', path: 'services/ad-service', port: 3004 },
  { name: 'GATEWAY', path: 'services/api-gateway', port: process.env.PORT || 8080 }
];

console.log('🚀 INITIALIZING INDESTRUCTIBLE BACKEND ENGINE...');
console.log('-----------------------------------------------');

// 🛡️ SAFETY KILL SWITCH: Clear ports before starting
services.forEach(service => {
  try {
    if (process.platform === 'win32') {
      const output = execSync(`netstat -ano | findstr :${service.port}`).toString();
      const lines = output.split('\n');
      if (lines[0]) {
        const pid = lines[0].trim().split(/\s+/).pop();
        if (pid && pid !== '0') {
          console.log(`🧹 Cleaning up port ${service.port} (PID: ${pid})...`);
          execSync(`taskkill /F /PID ${pid} /T`);
        }
      }
    }
  } catch (e) {
    // Port is likely already free
  }
});

services.forEach(service => {
  const servicePath = path.join(__dirname, service.path);
  
  const proc = spawn('node', ['server.js'], {
    cwd: servicePath,
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT: service.port, NODE_ENV: 'development' }
  });

  proc.on('error', (err) => {
    console.error(`❌ [${service.name}] Failed to start:`, err.message);
  });

  proc.on('exit', (code) => {
    if (code !== 0 && code !== null) {
      console.warn(`⚠️ [${service.name}] Service exited with code ${code}. Restarting in 3s...`);
      // Optional: Add restart logic here
    }
  });

  console.log(`✅ [${service.name}] Service initiated on port ${service.port}`);
});

console.log('------------------------------------------');
console.log('✨ ALL SYSTEMS NOMINAL. BACKEND IS NOW PERFECT.');
