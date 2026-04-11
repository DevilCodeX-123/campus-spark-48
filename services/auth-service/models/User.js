import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['owner', 'college_admin', 'event_head', 'event_assistant', 'student'], 
    default: 'student' 
  },
  collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College' },
  collegeName: { type: String }, // For easier access
  isActive: { type: Boolean, default: true },
  assignedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }], // For helpers
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);
