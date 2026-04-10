import mongoose from 'mongoose';

const collegeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  website: { type: String },
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  logoUrl: { type: String },
  description: { type: String },
  isActive: { type: Boolean, default: true },
  approvedAt: { type: Date },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Owner/Admin
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('College', collegeSchema);
