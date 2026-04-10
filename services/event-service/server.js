import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/eventRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';

dotenv.config({ path: '../../.env' });

const app = express();

app.use(cors());
app.use(express.json());

app.use('/events', eventRoutes);
app.use('/budget', budgetRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Event Service is running', db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { dbName: 'campusconnect_events' })
  .then(() => {
    console.log('✅ Event Service connected to MongoDB database: campusconnect_events');
    app.listen(PORT, () => console.log(`🚀 Event Service running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Event Service MongoDB connection error:', err);
    process.exit(1);
  });
