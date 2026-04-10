export type UserRole = 'owner' | 'website_admin' | 'college_admin' | 'event_head' | 'helper' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  collegeId?: string;
  college?: string;
  assignedEvents?: string[];
  isActive: boolean;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  city: string;
  website: string;
  adminId: string;
  adminName: string;
  logoUrl?: string;
  description?: string;
  isActive: boolean;
  approvedAt: string;
  studentCount: number;
  eventCount: number;
}

export interface CollegeAdminRequest {
  id: string;
  name: string;
  email: string;
  collegeName: string;
  collegeCity: string;
  collegeWebsite: string;
  designation: string;
  idProofUrl: string;
  status: 'pending' | 'approved' | 'rejected';
  requestedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  collegeId: string;
  collegeName: string;
  category: string;
  capacity: number;
  seatsLeft: number;
  coverImage: string;
  isFree: boolean;
  price?: number;
  organizerId: string;
  teamMembers: string[];
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BudgetAllocation {
  category: 'venue' | 'food' | 'decoration' | 'marketing' | 'prizes' | 'misc';
  allocated: number;
  spent: number;
}

export interface Budget {
  id: string;
  eventId: string;
  totalBudget: number;
  allocations: BudgetAllocation[];
}

export interface Registration {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  eventId: string;
  eventTitle: string;
  collegeId: string;
  registeredAt: string;
  qrCode: string;
  status: 'confirmed' | 'cancelled';
  checkedIn: boolean;
  checkedInAt?: string;
  checkedInBy?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  createdBy: string;
  createdAt: string;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  owner: 'Website Owner',
  website_admin: 'Website Admin',
  college_admin: 'College Admin',
  event_head: 'College Event Head',
  helper: 'Event Organizer Helper',
  student: 'Student',
};

export const ROLE_PANEL_NAMES: Record<UserRole, string> = {
  owner: 'Owner Control Center',
  website_admin: 'Platform Admin Dashboard',
  college_admin: 'College Admin Dashboard',
  event_head: 'Event Head Dashboard',
  helper: 'Organizer Helper Panel',
  student: 'Student Portal',
};

export const ROLE_PANEL_CLASS: Record<UserRole, string> = {
  owner: 'panel-owner',
  website_admin: 'panel-platform-admin',
  college_admin: 'panel-college-admin',
  event_head: 'panel-event-head',
  helper: 'panel-helper',
  student: 'panel-student',
};

export const ROLE_ROUTES: Record<UserRole, string> = {
  owner: '/owner-access-9x72k',
  website_admin: '/admin',
  college_admin: '/college-admin',
  event_head: '/event-head',
  helper: '/helper',
  student: '/student',
};

export const EVENT_CATEGORIES = [
  'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 
  'Hackathon', 'Competition', 'Social', 'Career', 'Other'
];
