import mongoose from 'mongoose';

const winnerSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  eventTitle: { type: String, required: true },
  position: { 
    type: String, 
    enum: ['1st', '2nd', '3rd'], 
    required: true 
  },
  rewardPoints: { type: Number, default: 0 },
  certificateUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Winner', winnerSchema);
