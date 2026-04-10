import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { mockCollegeRequests, mockColleges, mockUsers, mockEvents, mockRegistrations } from '@/data/mockData';
import { Shield, Building2, Users, Calendar, AlertTriangle, CheckCircle, XCircle, Activity } from 'lucide-react';

const OwnerPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const [secretInput, setSecretInput] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const { ownerLogin } = useAuth();

  if (!user || user.role !== 'owner') {
    if (!authenticated) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="w-full max-w-sm rounded-2xl border border-destructive/30 bg-card p-8 shadow-xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <Shield className="h-6 w-6 text-destructive" />
            </div>
            <h2 className="text-center font-heading text-xl font-bold text-foreground">Owner Access</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">Enter the secret key to continue</p>
            <input
              type="password"
              value={secretInput}
              onChange={e => setSecretInput(e.target.value)}
              className="mt-4 w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-destructive"
              placeholder="Secret key"
            />
            <button
              onClick={() => { if (ownerLogin(secretInput)) setAuthenticated(true); }}
              className="mt-3 w-full rounded-lg bg-destructive px-4 py-2.5 text-sm font-medium text-destructive-foreground hover:opacity-90"
            >
              Access
            </button>
          </div>
        </div>
      );
    }
  }

  const tabs = [
    { id: 'requests', label: 'Pending Requests', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'colleges', label: 'All Colleges', icon: <Building2 className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="h-4 w-4" /> },
    { id: 'admins', label: 'Website Admins', icon: <Users className="h-4 w-4" /> },
  ];

  const pendingRequests = mockCollegeRequests.filter(r => r.status === 'pending');
  const websiteAdmins = mockUsers.filter(u => u.role === 'website_admin');

  return (
    <DashboardLayout role="owner" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Pending College Admin Requests ({pendingRequests.length})</h2>
          {pendingRequests.length === 0 ? (
            <p className="text-muted-foreground">No pending requests</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pendingRequests.map(req => (
                <div key={req.id} className="rounded-xl border border-border bg-card p-6 shadow-sm">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{req.collegeName}</h3>
                      <p className="text-sm text-muted-foreground">{req.collegeCity}</p>
                    </div>
                    <span className="rounded-full bg-warning/10 px-3 py-1 text-xs font-medium text-warning">Pending</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Applicant:</span> <span className="text-foreground">{req.name}</span></p>
                    <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{req.email}</span></p>
                    <p><span className="text-muted-foreground">Designation:</span> <span className="text-foreground">{req.designation}</span></p>
                    <p><span className="text-muted-foreground">Website:</span> <a href={req.collegeWebsite} className="text-primary hover:underline">{req.collegeWebsite}</a></p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button className="flex items-center gap-1 rounded-lg bg-success px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                      <CheckCircle className="h-4 w-4" /> Approve
                    </button>
                    <button className="flex items-center gap-1 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:opacity-90">
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'colleges' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">All Colleges ({mockColleges.length})</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">College</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">City</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Admin</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Events</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {mockColleges.map(c => (
                  <tr key={c.id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.city}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.adminName}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.eventCount}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${c.isActive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                        {c.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">Platform Analytics</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Colleges" value={mockColleges.length} icon={<Building2 className="h-5 w-5" />} />
            <StatCard label="Total Users" value={mockUsers.length} icon={<Users className="h-5 w-5" />} />
            <StatCard label="Total Events" value={mockEvents.length} icon={<Calendar className="h-5 w-5" />} />
            <StatCard label="Registrations" value={mockRegistrations.length} icon={<CheckCircle className="h-5 w-5" />} />
          </div>
          <div className="dashboard-section">
            <h3 className="font-heading text-lg font-semibold text-foreground">System Health</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {['Auth Service', 'Event Service', 'Registration Service', 'API Gateway'].map(s => (
                <div key={s} className="flex items-center gap-3 rounded-lg border border-border p-4">
                  <div className="h-3 w-3 rounded-full bg-success animate-pulse" />
                  <span className="text-sm font-medium text-foreground">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'admins' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Website Admins</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {websiteAdmins.map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-4 shadow-sm">
                <div>
                  <p className="font-medium text-foreground">{a.name}</p>
                  <p className="text-sm text-muted-foreground">{a.email}</p>
                </div>
                <button className="text-sm text-destructive hover:underline">Remove</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OwnerPanel;
