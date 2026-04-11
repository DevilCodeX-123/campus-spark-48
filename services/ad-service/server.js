import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import adRoutes from './routes/adRoutes.js';

dotenv.config({ path: '../../.env' });

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://collegeconnect-iota.vercel.app',
  'https://vercel.com/devil-boss-projects/college_connect/EyoMMDm6z9f37wh8ATZarJLYYCVx'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('onrender.com');
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());

// Main Routes
app.use('/ads', adRoutes);

// Health Check for Gateway
app.get('/health', (req, res) => {
  res.json({
    status: 'Ad Service is running',
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.AD_PORT || 3004;

const MONGO_URI = process.env.MONGO_URI;
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('🚀 Ad Service Connected to MongoDB');
    app.listen(PORT, () => console.log(`🌟 Ad Service active on port ${PORT}`));
  })
  .catch(err => console.error('❌ Ad Service DB Error:', err));
