import express from 'express';
import Event from '../models/Event.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify JWT and roles
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next();
};

// Create Event
router.post('/', verifyToken, checkRole(['owner', 'website_admin', 'college_admin', 'event_head']), async (req, res) => {
  try {
    const event = new Event({
      ...req.body,
      organizerId: req.user.id,
      seatsLeft: req.body.capacity
    });
    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Events (Filterable)
router.get('/', async (req, res) => {
  try {
    const { collegeId, category, status } = req.query;
    let query = {};
    if (collegeId) query.collegeId = collegeId;
    
    // Case-insensitive match for category to fix frontend filter discrepancies
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    if (status) query.status = status;

    const events = await Event.find(query).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Event by ID
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Event
router.put('/:id', verifyToken, checkRole(['owner', 'website_admin', 'college_admin', 'event_head']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Permissions check: College Admin/Event Head can only update their own college's events
    if (['college_admin', 'event_head'].includes(req.user.role) && event.collegeId.toString() !== req.user.collegeId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Event
router.delete('/:id', verifyToken, checkRole(['owner', 'website_admin', 'college_admin', 'event_head']), async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (['college_admin', 'event_head'].includes(req.user.role) && event.collegeId.toString() !== req.user.collegeId) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Team Management: Assign Helper
router.post('/:id/team', verifyToken, checkRole(['college_admin', 'event_head']), async (req, res) => {
  try {
    const { helperId } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (!event.teamMembers.includes(helperId)) {
      event.teamMembers.push(helperId);
      await event.save();
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
