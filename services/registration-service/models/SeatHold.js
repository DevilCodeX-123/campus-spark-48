import mongoose from 'mongoose';

const seatHoldSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, required: true },
  heldAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
});

// TTL Index: Automatically delete document when expiresAt is reached
seatHoldSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('SeatHold', seatHoldSchema);
