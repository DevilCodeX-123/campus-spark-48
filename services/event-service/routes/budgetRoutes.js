import express from 'express';
import Budget from '../models/Budget.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Reuse verify middleware (simplified for logic)
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

// Create or Update Budget
router.post('/:eventId', verifyToken, async (req, res) => {
  try {
    const { totalBudget, allocations } = req.body;
    let budget = await Budget.findOne({ eventId: req.params.eventId });

    if (budget) {
      budget.totalBudget = totalBudget;
      budget.allocations = allocations;
    } else {
      budget = new Budget({
        eventId: req.params.eventId,
        totalBudget,
        allocations
      });
    }

    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Budget for Event
router.get('/:eventId', async (req, res) => {
  try {
    const budget = await Budget.findOne({ eventId: req.params.eventId });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Log Spending
router.put('/:eventId/spend', verifyToken, async (req, res) => {
  try {
    const { category, amount } = req.body;
    const budget = await Budget.findOne({ eventId: req.params.eventId });
    if (!budget) return res.status(404).json({ message: 'Budget not found' });

    const allocation = budget.allocations.find(a => a.category === category);
    if (!allocation) return res.status(400).json({ message: 'Category not found' });

    allocation.spent += amount;
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
