import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.join(__dirname, '../.env') });

const MONGO_URI = process.env.MONGO_URI;

// Define Schemas manually to avoid module resolution complexity in root script
const CollegeSchema = new mongoose.Schema({
  name: String,
  city: String,
  website: String,
  isActive: { type: Boolean, default: true }
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  collegeId: mongoose.Schema.Types.ObjectId,
  collegeName: String,
  isActive: { type: Boolean, default: true }
});

const EventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: String,
  time: String,
  venue: String,
  collegeId: mongoose.Schema.Types.ObjectId,
  collegeName: String,
  category: String,
  capacity: Number,
  seatsLeft: Number,
  status: String,
  isFree: Boolean,
  organizerId: mongoose.Schema.Types.ObjectId
});

const College = mongoose.model('CollegeSeed', CollegeSchema, 'colleges');
const User = mongoose.model('UserSeed', UserSchema, 'users');
const Event = mongoose.model('EventSeed', EventSchema, 'events');

async function seed() {
  try {
    console.log('🚀 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGO_URI, { dbName: 'College_connect' });
    console.log('✅ Connected.');

    // 1. Seed College
    console.log('🌱 Seeding Colleges...');
    const collegeData = {
      name: 'Global Institute of Technology',
      city: 'Mumbai',
      website: 'https://git.edu.in',
      isActive: true
    };
    let college = await College.findOne({ name: collegeData.name });
    if (!college) {
      college = await new College(collegeData).save();
      console.log(`+ Created College: ${college.name}`);
    }

    // 2. Seed Admin User
    console.log('🌱 Seeding Admin User...');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    const adminData = {
      name: 'Platform Admin',
      email: 'admin@campusconnect.com',
      password: hashedPassword,
      role: 'website_admin',
      isActive: true
    };
    let admin = await User.findOne({ email: adminData.email });
    if (!admin) {
      admin = await new User(adminData).save();
      console.log(`+ Created Admin: ${admin.email}`);
    }

    // 3. Seed Events
    console.log('🌱 Seeding Events...');
    const demoEvents = [
      {
        title: 'Smart India Hackathon 2024',
        description: 'Compete with the best minds to solve real-world problems.',
        date: '2024-05-15',
        time: '09:00 AM',
        venue: 'Main Auditorium',
        collegeId: college._id,
        collegeName: college.name,
        category: 'Hackathon',
        capacity: 200,
        seatsLeft: 184,
        status: 'upcoming',
        isFree: true,
        organizerId: admin._id
      },
      {
        title: 'Cultural Night: Ethnos',
        description: 'A celebration of diversity through music and dance.',
        date: '2024-05-20',
        time: '06:00 PM',
        venue: 'Open Air Theater',
        collegeId: college._id,
        collegeName: college.name,
        category: 'Cultural',
        capacity: 500,
        seatsLeft: 320,
        status: 'upcoming',
        isFree: false,
        organizerId: admin._id
      }
    ];

    for (const e of demoEvents) {
      const exists = await Event.findOne({ title: e.title });
      if (!exists) {
        await new Event(e).save();
        console.log(`+ Created Event: ${e.title}`);
      }
    }

    console.log('✨ SYSTEM PERFECTION ACHIEVED: Database Seeded Successfully.');
    process.exit(0);
  } catch (err) {
    console.error('❌ FATAL ERROR DURING SEEDING:');
    console.error(err.message);
    process.exit(1);
  }
}

seed();
