import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';

import connectDB from './utils/db.js';

mongoose.set('strictQuery', false);

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

app.use('/events', eventRoutes);
app.use('/budget', budgetRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'Event Service is running', 
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    readyState: mongoose.connection.readyState
  });
});

const PORT = process.env.PORT || 3002;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Event Service running on port ${PORT}`));
};

start();
