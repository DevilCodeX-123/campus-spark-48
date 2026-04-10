import mongoose from 'mongoose';

const collegeAdminRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }, // Hashed
  collegeName: { type: String, required: true },
  collegeCity: { type: String, required: true },
  collegeWebsite: { type: String },
  designation: { type: String },
  idProofUrl: { type: String },
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected'], 
    default: 'pending' 
  },
  requestedAt: { type: Date, default: Date.now },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewedAt: { type: Date },
  rejectionReason: { type: String }
});

export default mongoose.model('CollegeAdminRequest', collegeAdminRequestSchema);
