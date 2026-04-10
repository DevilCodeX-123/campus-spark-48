import express from 'express';
import Registration from '../models/Registration.js';
import SeatHold from '../models/SeatHold.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Start Seat Hold (90s)
router.post('/hold', verifyToken, async (req, res) => {
  try {
    const { eventId } = req.body;
    
    // Check if user already has a hold or registration for this event
    const existingRegistration = await Registration.findOne({ userId: req.user.id, eventId });
    if (existingRegistration) return res.status(400).json({ message: 'Already registered for this event' });

    const existingHold = await SeatHold.findOne({ userId: req.user.id, eventId, isActive: true });
    if (existingHold) return res.json(existingHold);

    const expiresAt = new Date(Date.now() + 90 * 1000); // 90 seconds from now
    const hold = new SeatHold({
      userId: req.user.id,
      eventId,
      expiresAt
    });

    await hold.save();
    
    // Emit socket event to update seat counts (handled in server.js)
    req.io.emit('seat_held', { eventId });

    res.status(201).json(hold);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Confirm Registration
router.post('/confirm', verifyToken, async (req, res) => {
  try {
    const { eventId, collegeId } = req.body;
    
    // Check if hold exists and is active
    const hold = await SeatHold.findOne({ userId: req.user.id, eventId, isActive: true });
    if (!hold) return res.status(400).json({ message: 'Seat hold expired or not found' });

    // Generate unique QR code string
    const qrCode = `CC-${eventId}-${req.user.id}-${Date.now()}`;

    const registration = new Registration({
      userId: req.user.id,
      eventId,
      collegeId,
      qrCode
    });

    await registration.save();
    
    // Deactivate hold
    hold.isActive = false;
    await hold.save();

    res.status(201).json(registration);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get User Registrations
router.get('/user/:userId', verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId && req.user.role !== 'owner') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    const registrations = await Registration.find({ userId: req.params.userId });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// QR Check-in (Helper only)
router.post('/checkin', verifyToken, async (req, res) => {
  try {
    const { qrCode } = req.body;
    const registration = await Registration.findOne({ qrCode });
    if (!registration) return res.status(404).json({ message: 'Registration not found' });

    if (registration.checkedIn) return res.status(400).json({ message: 'Already checked in' });

    registration.checkedIn = true;
    registration.checkedInAt = Date.now();
    registration.checkedInBy = req.user.id;
    await registration.save();

    res.json({ message: 'Check-in successful', registration });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
