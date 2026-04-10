import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import registrationRoutes from './routes/registrationRoutes.js';

import connectDB from './utils/db.js';

mongoose.set('strictQuery', false);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
    methods: ["GET", "POST"],
    credentials: true
  }
});

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175'],
  credentials: true
}));
app.use(express.json());

// Pass io to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/register', registrationRoutes);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'Registration Service is running', 
    db: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    readyState: mongoose.connection.readyState
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3003;

const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => console.log(`🚀 Registration Service running on port ${PORT}`));
};

start();
