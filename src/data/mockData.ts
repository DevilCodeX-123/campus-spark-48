import type { User, College, CollegeAdminRequest, Event, Budget, Registration, Announcement } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Platform Owner', email: 'owner@campusconnect.com', role: 'owner', isActive: true, createdAt: '2024-01-01' },
  { id: 'u2', name: 'Sarah Admin', email: 'sarah@campusconnect.com', role: 'website_admin', isActive: true, createdAt: '2024-01-05' },
  { id: 'u3', name: 'Dr. Rajesh Kumar', email: 'rajesh@iitd.ac.in', role: 'college_admin', collegeId: 'c1', college: 'IIT Delhi', isActive: true, createdAt: '2024-01-10' },
  { id: 'u4', name: 'Prof. Meera Sharma', email: 'meera@bits.ac.in', role: 'college_admin', collegeId: 'c2', college: 'BITS Pilani', isActive: true, createdAt: '2024-01-12' },
  { id: 'u5', name: 'Arjun Patel', email: 'arjun@iitd.ac.in', role: 'event_head', collegeId: 'c1', college: 'IIT Delhi', isActive: true, createdAt: '2024-02-01' },
  { id: 'u6', name: 'Priya Singh', email: 'priya@bits.ac.in', role: 'event_head', collegeId: 'c2', college: 'BITS Pilani', isActive: true, createdAt: '2024-02-05' },
  { id: 'u7', name: 'Rahul Verma', email: 'rahul@iitd.ac.in', role: 'helper', collegeId: 'c1', college: 'IIT Delhi', assignedEvents: ['e1', 'e3'], isActive: true, createdAt: '2024-02-15' },
  { id: 'u8', name: 'Ananya Das', email: 'ananya@iitd.ac.in', role: 'student', collegeId: 'c1', college: 'IIT Delhi', isActive: true, createdAt: '2024-03-01' },
  { id: 'u9', name: 'Vikram Joshi', email: 'vikram@bits.ac.in', role: 'student', collegeId: 'c2', college: 'BITS Pilani', isActive: true, createdAt: '2024-03-05' },
  { id: 'u10', name: 'Neha Gupta', email: 'neha@iitd.ac.in', role: 'student', collegeId: 'c1', college: 'IIT Delhi', isActive: true, createdAt: '2024-03-10' },
  { id: 'u11', name: 'Karan Mehta', email: 'karan@bits.ac.in', role: 'helper', collegeId: 'c2', college: 'BITS Pilani', assignedEvents: ['e2'], isActive: true, createdAt: '2024-02-20' },
];

export const mockColleges: College[] = [
  { id: 'c1', name: 'IIT Delhi', city: 'New Delhi', website: 'https://iitd.ac.in', adminId: 'u3', adminName: 'Dr. Rajesh Kumar', logoUrl: '', description: 'Indian Institute of Technology Delhi - Premier engineering institution', isActive: true, approvedAt: '2024-01-10', studentCount: 4, eventCount: 3 },
  { id: 'c2', name: 'BITS Pilani', city: 'Pilani', website: 'https://bits-pilani.ac.in', adminId: 'u4', adminName: 'Prof. Meera Sharma', logoUrl: '', description: 'Birla Institute of Technology and Science', isActive: true, approvedAt: '2024-01-12', studentCount: 3, eventCount: 2 },
];

export const mockCollegeRequests: CollegeAdminRequest[] = [
  { id: 'req1', name: 'Dr. Amit Bansal', email: 'amit@vit.ac.in', collegeName: 'VIT Vellore', collegeCity: 'Vellore', collegeWebsite: 'https://vit.ac.in', designation: 'Dean of Students', idProofUrl: 'https://example.com/id1.jpg', status: 'pending', requestedAt: '2024-03-15T10:30:00Z' },
  { id: 'req2', name: 'Prof. Sonia Roy', email: 'sonia@nit.ac.in', collegeName: 'NIT Trichy', collegeCity: 'Tiruchirappalli', collegeWebsite: 'https://nitt.edu', designation: 'Associate Professor', idProofUrl: 'https://example.com/id2.jpg', status: 'pending', requestedAt: '2024-03-16T14:20:00Z' },
  { id: 'req3', name: 'Dr. Rakesh Jain', email: 'rakesh@iisc.ac.in', collegeName: 'IISc Bangalore', collegeCity: 'Bangalore', collegeWebsite: 'https://iisc.ac.in', designation: 'Professor', idProofUrl: 'https://example.com/id3.jpg', status: 'pending', requestedAt: '2024-03-17T09:00:00Z' },
];

export const mockEvents: Event[] = [
  { id: 'e1', title: 'TechFest 2024', description: 'Annual technical festival featuring coding competitions, robotics, and AI workshops. Join 500+ students from across India.', date: '2024-04-15', time: '09:00', venue: 'Main Auditorium, IIT Delhi', collegeId: 'c1', collegeName: 'IIT Delhi', category: 'Technical', capacity: 500, seatsLeft: 342, coverImage: '', isFree: true, organizerId: 'u5', teamMembers: ['u7'], status: 'upcoming', createdAt: '2024-03-01' },
  { id: 'e2', title: 'Cultural Night', description: 'An evening of music, dance, and drama performances by students from BITS Pilani.', date: '2024-04-20', time: '18:00', venue: 'Open Air Theatre, BITS Pilani', collegeId: 'c2', collegeName: 'BITS Pilani', category: 'Cultural', capacity: 300, seatsLeft: 156, coverImage: '', isFree: true, organizerId: 'u6', teamMembers: ['u11'], status: 'upcoming', createdAt: '2024-03-05' },
  { id: 'e3', title: 'AI/ML Workshop', description: 'Hands-on workshop on machine learning fundamentals with industry experts from Google and Microsoft.', date: '2024-04-25', time: '10:00', venue: 'CS Department Lab 3, IIT Delhi', collegeId: 'c1', collegeName: 'IIT Delhi', category: 'Workshop', capacity: 100, seatsLeft: 23, coverImage: '', isFree: false, price: 299, organizerId: 'u5', teamMembers: ['u7'], status: 'upcoming', createdAt: '2024-03-10' },
  { id: 'e4', title: 'Hackathon 2024', description: '24-hour hackathon with prizes worth ₹5,00,000. Build solutions for real-world problems.', date: '2024-05-01', time: '08:00', venue: 'Innovation Hub, IIT Delhi', collegeId: 'c1', collegeName: 'IIT Delhi', category: 'Hackathon', capacity: 200, seatsLeft: 87, coverImage: '', isFree: false, price: 499, organizerId: 'u5', teamMembers: [], status: 'upcoming', createdAt: '2024-03-15' },
  { id: 'e5', title: 'Career Fair', description: 'Meet top recruiters from 50+ companies. Bring your resume and dress professionally.', date: '2024-05-10', time: '09:00', venue: 'Convention Center, BITS Pilani', collegeId: 'c2', collegeName: 'BITS Pilani', category: 'Career', capacity: 400, seatsLeft: 280, coverImage: '', isFree: true, organizerId: 'u6', teamMembers: [], status: 'upcoming', createdAt: '2024-03-20' },
];

export const mockBudgets: Budget[] = [
  { id: 'b1', eventId: 'e1', totalBudget: 500000, allocations: [
    { category: 'venue', allocated: 100000, spent: 95000 },
    { category: 'food', allocated: 120000, spent: 80000 },
    { category: 'decoration', allocated: 50000, spent: 45000 },
    { category: 'marketing', allocated: 80000, spent: 60000 },
    { category: 'prizes', allocated: 100000, spent: 0 },
    { category: 'misc', allocated: 50000, spent: 20000 },
  ]},
  { id: 'b2', eventId: 'e4', totalBudget: 300000, allocations: [
    { category: 'venue', allocated: 50000, spent: 50000 },
    { category: 'food', allocated: 80000, spent: 0 },
    { category: 'decoration', allocated: 20000, spent: 15000 },
    { category: 'marketing', allocated: 50000, spent: 40000 },
    { category: 'prizes', allocated: 80000, spent: 0 },
    { category: 'misc', allocated: 20000, spent: 5000 },
  ]},
];

export const mockRegistrations: Registration[] = [
  { id: 'r1', userId: 'u8', userName: 'Ananya Das', userEmail: 'ananya@iitd.ac.in', eventId: 'e1', eventTitle: 'TechFest 2024', collegeId: 'c1', registeredAt: '2024-03-20T10:00:00Z', qrCode: 'CAMPUS-E1-U8-2024', status: 'confirmed', checkedIn: false },
  { id: 'r2', userId: 'u8', userName: 'Ananya Das', userEmail: 'ananya@iitd.ac.in', eventId: 'e3', eventTitle: 'AI/ML Workshop', collegeId: 'c1', registeredAt: '2024-03-21T12:00:00Z', qrCode: 'CAMPUS-E3-U8-2024', status: 'confirmed', checkedIn: false },
  { id: 'r3', userId: 'u10', userName: 'Neha Gupta', userEmail: 'neha@iitd.ac.in', eventId: 'e1', eventTitle: 'TechFest 2024', collegeId: 'c1', registeredAt: '2024-03-22T14:00:00Z', qrCode: 'CAMPUS-E1-U10-2024', status: 'confirmed', checkedIn: true, checkedInAt: '2024-04-15T09:15:00Z', checkedInBy: 'u7' },
  { id: 'r4', userId: 'u9', userName: 'Vikram Joshi', userEmail: 'vikram@bits.ac.in', eventId: 'e2', eventTitle: 'Cultural Night', collegeId: 'c2', registeredAt: '2024-03-23T09:00:00Z', qrCode: 'CAMPUS-E2-U9-2024', status: 'confirmed', checkedIn: false },
  { id: 'r5', userId: 'u9', userName: 'Vikram Joshi', userEmail: 'vikram@bits.ac.in', eventId: 'e5', eventTitle: 'Career Fair', collegeId: 'c2', registeredAt: '2024-03-24T11:00:00Z', qrCode: 'CAMPUS-E5-U9-2024', status: 'confirmed', checkedIn: false },
];

export const mockAnnouncements: Announcement[] = [
  { id: 'a1', title: 'Platform Maintenance Scheduled', content: 'CampusConnect will undergo scheduled maintenance on April 30th from 2 AM to 6 AM IST.', createdBy: 'Sarah Admin', createdAt: '2024-03-25T10:00:00Z' },
  { id: 'a2', title: 'New Feature: Budget Manager', content: 'Event heads can now manage event budgets with detailed category-wise tracking.', createdBy: 'Sarah Admin', createdAt: '2024-03-20T15:00:00Z' },
];
