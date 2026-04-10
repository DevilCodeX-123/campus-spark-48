import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { Building2, Users, Calendar, BarChart3, UserPlus } from 'lucide-react';
import { ROLE_LABELS } from '@/types';

const CollegeAdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const { data: students = [] } = useQuery({
    queryKey: ['collegeStudents', user?.collegeId],
    queryFn: async () => {
      const res = await api.get(`/auth/users?collegeId=${user?.collegeId}&role=student`);
      return res.data;
    },
    enabled: !!user?.collegeId
  });

  const { data: events = [] } = useQuery({
    queryKey: ['collegeEvents', user?.collegeId],
    queryFn: async () => {
      const res = await api.get(`/events?collegeId=${user?.collegeId}`);
      return res.data;
    },
    enabled: !!user?.collegeId
  });

  const collegeEventHeads = students.filter(u => u.role === 'event_head');
  const collegeRegistrations = []; // Placeholder as per original structure

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Building2 className="h-4 w-4" /> },
    { id: 'students', label: 'Students', icon: <Users className="h-4 w-4" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
    { id: 'team', label: 'Event Heads', icon: <UserPlus className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout role="college_admin" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Students" value={collegeStudents.length} icon={<Users className="h-5 w-5" />} />
            <StatCard label="Events" value={collegeEvents.length} icon={<Calendar className="h-5 w-5" />} />
            <StatCard label="Event Heads" value={collegeEventHeads.length} icon={<UserPlus className="h-5 w-5" />} />
            <StatCard label="Registrations" value={collegeRegistrations.length} icon={<BarChart3 className="h-5 w-5" />} />
          </div>
          <div className="dashboard-section">
            <h3 className="font-heading text-lg font-semibold text-foreground">College Profile</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-muted-foreground">College Name</label>
                <p className="mt-1 text-foreground">{user?.college || 'IIT Delhi'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="mt-1 text-foreground">Premier engineering institution in India</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Students ({collegeStudents.length})</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {collegeStudents.map(s => (
                  <tr key={s.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{s.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{s.email}</td>
                    <td className="px-4 py-3">
                      <button className="rounded-md bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20">
                        Assign Event Head
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-foreground">Events ({collegeEvents.length})</h2>
            <button className="panel-accent-btn text-sm">+ Create Event</button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {collegeEvents.map(e => (
              <div key={e.id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <h3 className="font-heading font-semibold text-foreground">{e.title}</h3>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    e.status === 'upcoming' ? 'bg-info/10 text-info' :
                    e.status === 'ongoing' ? 'bg-success/10 text-success' :
                    'bg-muted text-muted-foreground'
                  }`}>{e.status}</span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{e.date} • {e.venue}</p>
                <p className="mt-1 text-sm text-muted-foreground">{e.seatsLeft}/{e.capacity} seats left</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Event Heads ({collegeEventHeads.length})</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {collegeEventHeads.map(h => (
              <div key={h.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <p className="font-medium text-foreground">{h.name}</p>
                  <p className="text-sm text-muted-foreground">{h.email}</p>
                </div>
                <span className="panel-accent-badge">{ROLE_LABELS[h.role]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CollegeAdminDashboard;
