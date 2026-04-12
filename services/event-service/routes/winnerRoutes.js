import express from 'express';
import Winner from '../models/Winner.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware to verify Admin/Event Head
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!['owner', 'website_admin', 'college_admin', 'event_head'].includes(decoded.role)) {
      return res.status(403).json({ message: 'Unauthorized for winner management' });
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// POST /add - Add winners
router.post('/add', verifyAdmin, async (req, res) => {
  try {
    const winner = new Winner(req.body);
    await winner.save();
    res.status(201).json(winner);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /user/:userId - Get user achievements
router.get('/user/:userId', async (req, res) => {
  try {
    const achievements = await Winner.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    res.json(achievements);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /leaderboard - Rank users
router.get('/leaderboard', async (req, res) => {
  try {
    const leaderboard = await Winner.aggregate([
      {
        $group: {
          _id: '$userId',
          userName: { $first: '$userName' },
          totalPoints: { $sum: '$rewardPoints' },
          achievements: { $push: { event: '$eventTitle', pos: '$position' } }
        }
      },
      { $sort: { totalPoints: -1 } },
      { $limit: 20 }
    ]);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
