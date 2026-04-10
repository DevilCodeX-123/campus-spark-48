import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import BudgetManager from '@/components/BudgetManager';
import { Calendar, Users, BarChart3, Plus, Loader2, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const EventHeadDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const queryClient = useQueryClient();

  const { data: myEvents = [], isLoading: isLoadingEvents } = useQuery({
    queryKey: ['myManagedEvents', user?.id],
    queryFn: async () => {
      const res = await api.get(`/events?collegeId=${user?.collegeId}`);
      return res.data.filter((e: any) => e.organizerId === user?.id);
    },
    enabled: !!user?.id
  });

  const { data: registrations = [], isLoading: isLoadingRegs } = useQuery({
    queryKey: ['eventRegistrations', user?.id],
    queryFn: async () => {
      // Fetch registrations for all managed events
      const allRegs = await Promise.all(myEvents.map((e: any) => api.get(`/register/event/${e._id}`)));
      return allRegs.flatMap(res => res.data);
    },
    enabled: myEvents.length > 0
  });

  const { data: budgets = [] } = useQuery({
    queryKey: ['eventBudgets', user?.id],
    queryFn: async () => {
      const allBudgets = await Promise.all(myEvents.map((e: any) => api.get(`/events/budget/${e._id}`)));
      return allBudgets.map(res => res.data);
    },
    enabled: myEvents.length > 0
  });

  const tabs = [
    { id: 'events', label: 'My Events', icon: <Calendar className="h-4 w-4" /> },
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
            <h2 className="font-heading text-xl font-semibold text-foreground">My Managed Events</h2>
            <button className="panel-accent-btn flex items-center gap-2 text-sm"><Plus className="h-4 w-4" /> Create Event</button>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Total Events" value={myEvents.length} icon={<Calendar className="h-5 w-5" />} color="teal" />
            <StatCard label="Registrations" value={registrations.length} icon={<Users className="h-5 w-5" />} color="blue" />
            <StatCard label="Check-ins" value={registrations.filter((r: any) => r.checkedIn).length} icon={<BarChart3 className="h-5 w-5" />} color="purple" />
          </div>

          {isLoadingEvents ? (
            <div className="flex h-48 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {myEvents.map((e: any) => (
                <div key={e._id} className="rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{e.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{e.category} • {e.date}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      e.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                    }`}>{e.status}</span>
                  </div>
                  <div className="mt-6 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{e.seatsLeft}/{e.capacity} seats remaining</span>
                    <div className="flex gap-2">
                      <button className="text-xs font-bold text-primary hover:underline">Edit</button>
                      <button className="text-xs font-bold text-destructive hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">Event Budgeting</h2>
          {budgets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground">Select an event to manage its budget</div>
          ) : (
            budgets.map((b: any) => (
              <BudgetManager key={b._id} budget={b} eventTitle={myEvents.find((e: any) => e._id === b.eventId)?.title || 'Event'} />
            ))
          )}
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">Event Insights</h2>
          <div className="dashboard-section rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-6 text-sm font-medium text-muted-foreground uppercase tracking-widest">Registration Velocity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={registrationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="registrations" stroke="#0d9488" strokeWidth={3} dot={{ r: 4, fill: '#0d9488', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default EventHeadDashboard;
