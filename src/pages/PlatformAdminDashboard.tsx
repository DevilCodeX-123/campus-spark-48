import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { mockCollegeRequests, mockColleges, mockUsers, mockEvents, mockAnnouncements } from '@/data/mockData';
import { ROLE_LABELS } from '@/types';
import { AlertTriangle, Building2, Users, Calendar, Megaphone, CheckCircle, XCircle } from 'lucide-react';

const PlatformAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Building2 className="h-4 w-4" /> },
    { id: 'requests', label: 'Requests', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone className="h-4 w-4" /> },
  ];

  const pendingRequests = mockCollegeRequests.filter(r => r.status === 'pending');

  return (
    <DashboardLayout role="website_admin" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Colleges" value={mockColleges.length} icon={<Building2 className="h-5 w-5" />} />
            <StatCard label="Users" value={mockUsers.length} icon={<Users className="h-5 w-5" />} />
            <StatCard label="Events" value={mockEvents.length} icon={<Calendar className="h-5 w-5" />} />
            <StatCard label="Pending Requests" value={pendingRequests.length} icon={<AlertTriangle className="h-5 w-5" />} trend={pendingRequests.length > 0 ? `${pendingRequests.length} awaiting review` : undefined} />
          </div>
          <div className="dashboard-section">
            <h3 className="font-heading text-lg font-semibold text-foreground">Recent Events</h3>
            <div className="mt-4 space-y-3">
              {mockEvents.slice(0, 3).map(e => (
                <div key={e.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                  <div>
                    <p className="font-medium text-foreground">{e.title}</p>
                    <p className="text-sm text-muted-foreground">{e.collegeName} • {e.date}</p>
                  </div>
                  <span className="text-sm text-muted-foreground">{e.seatsLeft}/{e.capacity} seats left</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">College Admin Requests</h2>
          {pendingRequests.map(req => (
            <div key={req.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{req.collegeName}</h3>
                  <p className="text-sm text-muted-foreground">{req.name} • {req.designation} • {req.collegeCity}</p>
                </div>
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 rounded-lg bg-success px-3 py-1.5 text-sm font-medium text-primary-foreground"><CheckCircle className="h-3.5 w-3.5" /> Approve</button>
                  <button className="flex items-center gap-1 rounded-lg bg-destructive px-3 py-1.5 text-sm font-medium text-destructive-foreground"><XCircle className="h-3.5 w-3.5" /> Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">All Users</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">College</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockUsers.filter(u => u.role !== 'owner').map(u => (
                  <tr key={u.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3"><span className="panel-accent-badge">{ROLE_LABELS[u.role]}</span></td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{u.college || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Announcements</h2>
          {mockAnnouncements.map(a => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-heading font-semibold text-foreground">{a.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{a.content}</p>
              <p className="mt-3 text-xs text-muted-foreground">By {a.createdBy} • {new Date(a.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PlatformAdminDashboard;
