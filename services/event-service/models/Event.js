import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },
  time: { type: String, required: true },
  venue: { type: String, required: true },
  collegeId: { type: mongoose.Schema.Types.ObjectId, required: true },
  collegeName: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Hackathon', 'Career', 'Misc'],
    default: 'Misc'
  },
  capacity: { type: Number, required: true },
  seatsLeft: { type: Number, required: true },
  coverImage: { type: String },
  isFree: { type: Boolean, default: true },
  price: { type: Number, default: 0 },
  organizerId: { type: mongoose.Schema.Types.ObjectId, required: true }, // College Admin or Event Head
  teamMembers: [{ type: mongoose.Schema.Types.ObjectId }], // Helper IDs
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], 
    default: 'upcoming' 
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Event', eventSchema);
