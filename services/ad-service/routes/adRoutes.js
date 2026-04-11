import express from 'express';
import Ad from '../models/Ad.js';

const router = express.Router();

// Get active ads
router.get('/active', async (req, res) => {
  try {
    const { placement, college, category } = req.query;
    const now = new Date();
    const query = {
      active: true,
      startDate: { $lte: now },
      endDate: { $gte: now }
    };

    if (placement) query.placement = placement;
    
    const ads = await Ad.find(query);
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all ads
router.get('/all', async (req, res) => {
  try {
    const ads = await Ad.find().sort({ createdAt: -1 });
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create Ad
router.post('/', async (req, res) => {
  try {
    const ad = await Ad.create(req.body);
    res.status(201).json(ad);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Record View
router.post('/:id/view', async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Record Click
router.post('/:id/click', async (req, res) => {
  try {
    await Ad.findByIdAndUpdate(req.params.id, { $inc: { clicks: 1 } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
