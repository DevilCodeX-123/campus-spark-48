import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import adRoutes from './routes/adRoutes.js';

dotenv.config({ path: '../../.env' });

const app = express();

app.use(cors());
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
