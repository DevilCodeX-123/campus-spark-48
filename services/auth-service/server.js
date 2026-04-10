import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';

dotenv.config({ path: '../../.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/owner', ownerRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ status: 'Auth Service is running', db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

// Database Connection
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { 
  dbName: 'College_connect',
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s for faster feedback
  connectTimeoutMS: 10000 
})
  .then(() => {
    console.log('✅ Auth Service connected to MongoDB database: College_connect');
    app.listen(PORT, () => console.log(`🚀 Auth Service running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ AUTH SERVICE DATABASE CONNECTION CRITICAL ERROR:');
    console.error('Error Name:', err.name);
    console.error('Error Code:', err.code);
    console.error('Full Message:', err.message);
    
    if (err.message.includes('timeout')) {
      console.warn('⚠️ RECOMMENDATION: Check your MongoDB Atlas IP Whitelist (add 0.0.0.0/0).');
    }
    
    // Don't exit in production immediately, allow health check to report 'DOWN'
    console.log('Service starting in DEGRADED mode (No DB)');
    app.listen(PORT, () => console.log(`🚀 Auth Service (DEGRADED) running on port ${PORT}`));
  });
