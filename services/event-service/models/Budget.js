import mongoose from 'mongoose';

const allocationSchema = new mongoose.Schema({
  category: { 
    type: String, 
    enum: ['venue', 'food', 'decoration', 'marketing', 'prizes', 'misc'],
    required: true
  },
  allocated: { type: Number, default: 0 },
  spent: { type: Number, default: 0 }
});

const budgetSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, unique: true },
  totalBudget: { type: Number, required: true },
  allocations: [allocationSchema],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Budget', budgetSchema);
