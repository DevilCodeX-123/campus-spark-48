import express from 'express';
import CollegeAdminRequest from '../models/CollegeAdminRequest.js';
import User from '../models/User.js';
import College from '../models/College.js';

const router = express.Router();

// Middleware to check Owner Secret Key
const ownerAuth = (req, res, next) => {
  const secret = req.headers['x-owner-secret-key'];
  if (secret !== process.env.OWNER_SECRET_KEY) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

// Get Pending Requests
router.get('/requests', ownerAuth, async (req, res) => {
  try {
    const requests = await CollegeAdminRequest.find({ status: 'pending' });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Approve Request
router.post('/approve/:requestId', ownerAuth, async (req, res) => {
  try {
    const request = await CollegeAdminRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    // Create College
    const college = new College({
      name: request.collegeName,
      city: request.collegeCity,
      website: request.collegeWebsite,
      isActive: true,
      approvedAt: Date.now()
    });
    await college.save();

    // Create College Admin User
    const user = new User({
      name: request.name,
      email: request.email,
      password: request.password, // Already hashed in request
      role: 'college_admin',
      collegeId: college._id,
      collegeName: college.name,
      isActive: true
    });
    await user.save();

    // Update College with Admin ID
    college.adminId = user._id;
    await college.save();

    // Update Request status
    request.status = 'approved';
    request.reviewedAt = Date.now();
    await request.save();

    res.json({ message: 'College and Admin approved successfully', college, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject Request
router.post('/reject/:requestId', ownerAuth, async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await CollegeAdminRequest.findById(req.params.requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'rejected';
    request.rejectionReason = reason;
    request.reviewedAt = Date.now();
    await request.save();

    res.json({ message: 'Request rejected' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Assign Website Admin
router.post('/assign-website-admin', ownerAuth, async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = 'owner';
    await user.save();

    res.json({ message: 'Role updated to Platform Owner' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
