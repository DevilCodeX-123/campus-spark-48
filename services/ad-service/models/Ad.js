import mongoose from 'mongoose';

const adSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  mediaUrl: { type: String, required: true },
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  placement: { type: String, enum: ['homepage_banner', 'events_listing', 'event_detail'], default: 'homepage_banner' },
  targetCollege: { type: String },
  targetCategory: { type: String },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  clicks: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

const Ad = mongoose.model('Ad', adSchema);
export default Ad;
