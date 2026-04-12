import mongoose from 'mongoose';

const campusMapSchema = new mongoose.Schema({
  collegeId: { type: String, required: true, unique: true },
  mapImageUrl: { type: String, required: true },
  geoData: {
    markers: [
      {
        id: String,
        label: String,
        type: { type: String, enum: ['venue', 'gate', 'food', 'help'] },
        lat: Number,
        lng: Number
      }
    ]
  },
  uploadedBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CampusMap', campusMapSchema);
