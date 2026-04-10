import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import BudgetManager from '@/components/BudgetManager';
import { useAuth } from '@/context/AuthContext';
import { mockEvents, mockBudgets, mockRegistrations, mockUsers } from '@/data/mockData';
import { Calendar, Users, DollarSign, BarChart3, Plus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EventHeadDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');

  const collegeId = user?.collegeId || 'c1';
  const myEvents = mockEvents.filter(e => e.collegeId === collegeId);
  const myRegistrations = mockRegistrations.filter(r => myEvents.some(e => e.id === r.eventId));
  const helpers = mockUsers.filter(u => u.collegeId === collegeId && u.role === 'helper');

  const tabs = [
    { id: 'events', label: 'My Events', icon: <Calendar className="h-4 w-4" /> },
    { id: 'team', label: 'Team', icon: <Users className="h-4 w-4" /> },
    { id: 'budget', label: 'Budget', icon: <DollarSign className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
  ];

  const registrationData = [
    { day: 'Mon', registrations: 12 }, { day: 'Tue', registrations: 19 },
    { day: 'Wed', registrations: 8 }, { day: 'Thu', registrations: 25 },
    { day: 'Fri', registrations: 32 }, { day: 'Sat', registrations: 15 },
    { day: 'Sun', registrations: 20 },
  ];

  return (
    <DashboardLayout role="event_head" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-foreground">My Events ({myEvents.length})</h2>
            <button className="panel-accent-btn flex items-center gap-2 text-sm"><Plus className="h-4 w-4" /> Create Event</button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Events" value={myEvents.length} icon={<Calendar className="h-5 w-5" />} />
            <StatCard label="Registrations" value={myRegistrations.length} icon={<Users className="h-5 w-5" />} />
            <StatCard label="Team Members" value={helpers.length} icon={<Users className="h-5 w-5" />} />
            <StatCard label="Check-ins" value={myRegistrations.filter(r => r.checkedIn).length} icon={<BarChart3 className="h-5 w-5" />} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {myEvents.map(e => (
              <div key={e.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{e.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{e.category} • {e.date}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    e.status === 'upcoming' ? 'bg-info/10 text-info' : 'bg-success/10 text-success'
                  }`}>{e.status}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{e.seatsLeft}/{e.capacity} seats</span>
                  <div className="flex gap-2">
                    <button className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary">Edit</button>
                    <button className="rounded-md bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Team Members</h2>
          <button className="panel-accent-btn text-sm">+ Assign Helper</button>
          <div className="grid gap-4 md:grid-cols-2">
            {helpers.map(h => (
              <div key={h.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <p className="font-medium text-foreground">{h.name}</p>
                  <p className="text-sm text-muted-foreground">{h.email}</p>
                  {h.assignedEvents && <p className="mt-1 text-xs text-muted-foreground">Assigned to {h.assignedEvents.length} event(s)</p>}
                </div>
                <button className="text-sm text-destructive hover:underline">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">Budget Manager</h2>
          {mockBudgets.map(b => {
            const event = mockEvents.find(e => e.id === b.eventId);
            return <BudgetManager key={b.id} budget={b} eventTitle={event?.title || ''} />;
          })}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">Event Analytics</h2>
          <div className="dashboard-section">
            <h3 className="mb-4 text-sm font-medium text-muted-foreground">Registrations This Week</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="registrations" stroke="hsl(175, 70%, 40%)" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EventHeadDashboard;
