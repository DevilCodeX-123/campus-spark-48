import express from 'express';
import CampusMap from '../models/CampusMap.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

const verifyCollegeAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!['owner', 'college_admin'].includes(decoded.role)) return res.status(403).json({ message: 'Unauthorized' });
    req.user = decoded;
    next();
  } catch (err) { res.status(401).json({ message: 'Invalid token' }); }
};

// POST /upload - Upload map
router.post('/upload', verifyCollegeAdmin, async (req, res) => {
  try {
    const { collegeId, mapImageUrl, geoData } = req.body;
    const map = await CampusMap.findOneAndUpdate(
      { collegeId },
      { mapImageUrl, geoData, uploadedBy: req.user.id },
      { upsert: true, new: true }
    );
    res.json(map);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /:collegeId - Fetch map
router.get('/:collegeId', async (req, res) => {
  try {
    const map = await CampusMap.findOne({ collegeId: req.params.collegeId });
    if (!map) return res.status(404).json({ message: 'Map not found for this college' });
    res.json(map);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

export default router;
