import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import QRCodeCard from '@/components/QRCodeCard';
import { useAuth } from '@/context/AuthContext';
import { mockEvents, mockRegistrations } from '@/data/mockData';
import { Calendar, Ticket, User, Search } from 'lucide-react';

const StudentPortal: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const myRegistrations = mockRegistrations.filter(r => r.userId === (user?.id || 'u8'));
  const registeredEventIds = myRegistrations.map(r => r.eventId);

  const filteredEvents = mockEvents.filter(e => {
    const matchesSearch = e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.collegeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...new Set(mockEvents.map(e => e.category))];

  const tabs = [
    { id: 'browse', label: 'Browse Events', icon: <Search className="h-4 w-4" /> },
    { id: 'registrations', label: 'My Registrations', icon: <Ticket className="h-4 w-4" /> },
    { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout role="student" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'browse' && (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search events..."
                className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {categories.map(c => (
                <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map(e => (
              <div key={e.id} className="group rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Calendar className="h-10 w-10 text-primary/40" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <h3 className="font-heading font-semibold text-foreground">{e.title}</h3>
                    {!e.isFree && <span className="rounded-full bg-warning/10 px-2.5 py-0.5 text-xs font-medium text-warning">₹{e.price}</span>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{e.collegeName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.date} • {e.time}</p>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{e.seatsLeft} seats left</span>
                    {registeredEventIds.includes(e.id) ? (
                      <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-medium text-success">Registered</span>
                    ) : (
                      <button className="panel-accent-btn panel-student text-xs">Register</button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'registrations' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">My Registrations ({myRegistrations.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {myRegistrations.map(r => (
              <QRCodeCard
                key={r.id}
                value={r.qrCode}
                eventTitle={r.eventTitle}
                date={mockEvents.find(e => e.id === r.eventId)?.date || ''}
                venue={mockEvents.find(e => e.id === r.eventId)?.venue || ''}
              />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="dashboard-section max-w-md">
          <h2 className="font-heading text-xl font-semibold text-foreground">My Profile</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="mt-1 text-foreground">{user?.name || 'Student'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <p className="mt-1 text-foreground">{user?.email || ''}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">College</label>
              <p className="mt-1 text-foreground">{user?.college || ''}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Registered Events</label>
              <p className="mt-1 text-foreground">{myRegistrations.length}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default StudentPortal;
