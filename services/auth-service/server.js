import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';

import connectDB from './utils/db.js';

dotenv.config({ path: '../../.env' });

// Mongoose Polish
mongoose.set('strictQuery', false);

const app = express();

// Middleware - Multi-port CORS for development perfection
// Middleware - Multi-port CORS for development and dynamic production
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5174', 
  'http://localhost:5175',
  'https://collegeconnect-iota.vercel.app'
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

// Routes
app.use('/auth', authRoutes);
app.use('/owner', ownerRoutes);

// Health Check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'Auth Service is running', 
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    readyState: mongoose.connection.readyState 
  });
});

// Start Service
const PORT = process.env.PORT || 3001;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Auth Service running on port ${PORT}`));
};

start();
