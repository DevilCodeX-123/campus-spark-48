import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import registrationRoutes from './routes/registrationRoutes.js';

dotenv.config({ path: '../../.env' });

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/register', registrationRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'Registration Service is running', db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected' });
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, { dbName: 'College_connect' })
  .then(() => {
    console.log('✅ Registration Service connected to MongoDB database: College_connect');
    httpServer.listen(PORT, () => console.log(`🚀 Registration Service running on port ${PORT}`));
  })
  .catch(err => {
    console.error('❌ Registration Service MongoDB connection error:', err);
    process.exit(1);
  });
