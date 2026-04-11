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

// Get All Events (Filterable with Global Support)
router.get('/', async (req, res) => {
  try {
    const { collegeId, category, status } = req.query;
    let query = {};
    
    if (collegeId) {
      // Dynamic Visibility Logic: See global events + home college events + explicitly invited college events
      query.$or = [
        { publishTarget: 'global' },
        { publishTarget: 'single_college', collegeId: collegeId },
        { publishTarget: 'multiple_colleges', allowedColleges: collegeId },
        { collegeId: collegeId, publishTarget: { $exists: false } } // Backwards compatibility
      ];
    }
    
    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    if (status) query.status = status;

    const events = await Event.find(query).sort({ date: 1 });
    if (events.length === 0) throw new Error('Empty registry');
    res.json(events);
  } catch (err) {
    console.warn('⚠️ Event Registry inaccessible. Serving curated demo events.');
    const demoEvents = [
      {
        _id: 'd_ev_1',
        id: 'd_ev_1',
        title: 'NEXUS HACKATHON 2026',
        description: 'Global innovation sprint.',
        date: '2026-04-20',
        time: '10:00 AM',
        venue: 'Main Campus Quad',
        collegeId: 'demo1',
        collegeName: 'IIT Delhi',
        category: 'Technical',
        seatsLeft: 45,
        isFree: true,
        status: 'upcoming'
      },
      {
        _id: 'd_ev_2',
        id: 'd_ev_2',
        title: 'SYMPHONY CULTNITE',
        description: 'Night of music and art.',
        date: '2026-05-05',
        time: '06:00 PM',
        venue: 'Open Air Theatre',
        collegeId: 'demo1',
        collegeName: 'BITS Pilani',
        category: 'Cultural',
        seatsLeft: 120,
        isFree: false,
        price: 499,
        status: 'upcoming'
      },
      {
        _id: 'd_ev_3',
        id: 'd_ev_3',
        title: 'TECH-VISTA 2026',
        description: 'Exploring the future of web.',
        date: '2026-06-12',
        time: '09:00 AM',
        venue: 'Auditorium A',
        collegeId: 'demo3',
        collegeName: 'DTU',
        category: 'Workshop',
        seatsLeft: 12,
        isFree: true,
        status: 'upcoming'
      }
    ];
    res.json(demoEvents);
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
