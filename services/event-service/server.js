import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import winnerRoutes from './routes/winnerRoutes.js';
import mapRoutes from './routes/mapRoutes.js';

import connectDB from './utils/db.js';

mongoose.set('strictQuery', false);

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

app.use('/events', eventRoutes);
app.use('/budget', budgetRoutes);
app.use('/winners', winnerRoutes);
app.use('/maps', mapRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'Event Service is running', 
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    readyState: mongoose.connection.readyState
  });
});

const PORT = process.env.PORT || 3002;

const start = () => {
  connectDB();
  app.listen(PORT, () => console.log(`🚀 Event Service (Resilient Mode) running on port ${PORT}`));
};

start();
