import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  registeredAt: { type: Date, default: Date.now },
  qrCode: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled'], 
    default: 'confirmed' 
  },
  checkedIn: { type: Boolean, default: false },
  checkedInAt: { type: Date },
  checkedInBy: { type: mongoose.Schema.Types.ObjectId } // Helper ID
});

export default mongoose.model('Registration', registrationSchema);
