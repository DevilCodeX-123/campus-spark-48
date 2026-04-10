import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import CollegeAdminRequest from '../models/CollegeAdminRequest.js';
import College from '../models/College.js';

const router = express.Router();

// Helper for JWT
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, collegeId: user.collegeId },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Student Registration
router.post('/register-student', async (req, res) => {
  try {
    const { name, email, password, collegeId, collegeName } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      collegeId,
      collegeName
    });

    await user.save();
    const token = generateToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, role: user.role, collegeId: user.collegeId } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// College Admin Request (Signup)
router.post('/register-college-admin', async (req, res) => {
  try {
    const { name, email, password, collegeName, collegeCity, collegeWebsite, designation, idProofUrl } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const request = new CollegeAdminRequest({
      name,
      email,
      password: hashedPassword,
      collegeName,
      collegeCity,
      collegeWebsite,
      designation,
      idProofUrl
    });

    await request.save();
    res.status(201).json({ message: 'College Admin request submitted. Waiting for approval.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login (All Roles)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    if (!user.isActive) return res.status(403).json({ message: 'Account is suspended' });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, role: user.role, collegeId: user.collegeId } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Current User
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Get Approved Colleges (for signup dropdown)
router.get('/colleges', async (req, res) => {
  try {
    const colleges = await College.find({ isActive: true });
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
