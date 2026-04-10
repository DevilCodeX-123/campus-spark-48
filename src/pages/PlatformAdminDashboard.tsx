import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { ROLE_LABELS } from '@/types';
import { AlertTriangle, Building2, Users, Calendar, Megaphone, CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

const PlatformAdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // Queries
  const { data: colleges = [], isLoading: isLoadingColleges } = useQuery({
    queryKey: ['platformColleges'],
    queryFn: async () => {
      const res = await api.get('/auth/colleges');
      return res.data;
    }
  });

  const { data: requests = [], isLoading: isLoadingRequests } = useQuery({
    queryKey: ['platformRequests'],
    queryFn: async () => {
      // Platform admins can see requests too
      const res = await api.get('/owner/requests', {
        headers: { 'x-owner-secret-key': 'ownerpass2024' } // Temporary for demonstration, normally would be a platform admin auth
      });
      return res.data;
    }
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['platformUsers'],
    queryFn: async () => {
      const res = await api.get('/auth/users'); // Mock endpoint or needs to be added to auth-service
      return res.data;
    }
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => api.post(`/owner/approve/${requestId}`, {}, { headers: { 'x-owner-secret-key': 'ownerpass2024' } }),
    onSuccess: () => {
      toast.success('Approved successfully');
      queryClient.invalidateQueries({ queryKey: ['platformRequests'] });
      queryClient.invalidateQueries({ queryKey: ['platformColleges'] });
    }
  });

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <Building2 className="h-4 w-4" /> },
    { id: 'requests', label: 'Requests', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'users', label: 'Users', icon: <Users className="h-4 w-4" /> },
    { id: 'announcements', label: 'Announcements', icon: <Megaphone className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout role="website_admin" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Colleges" value={colleges.length} icon={<Building2 className="h-5 w-5" />} color="purple" />
            <StatCard label="Total Users" value={users.length || '--'} icon={<Users className="h-5 w-5" />} color="purple" />
            <StatCard label="Live Events" value={'--'} icon={<Calendar className="h-5 w-5" />} color="purple" />
            <StatCard label="Pending Requests" value={requests.length} icon={<AlertTriangle className="h-5 w-5" />} color="purple" />
          </div>
          
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-heading text-lg font-semibold text-foreground">Active Colleges</h3>
            <div className="mt-4 space-y-3">
              {colleges.slice(0, 5).map((c: any) => (
                <div key={c._id} className="flex items-center justify-between rounded-lg border border-border p-4 bg-muted/20">
                  <div>
                    <p className="font-medium text-foreground">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.city} • Admin: {c.adminId || 'Unassigned'}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'requests' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">College Registration Requests</h2>
          {requests.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
              <CheckCircle className="mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">All caught up! No pending requests.</p>
            </div>
          ) : (
            requests.map((req: any) => (
              <div key={req._id} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-heading font-semibold text-foreground">{req.collegeName}</h3>
                    <p className="text-sm text-muted-foreground">{req.name} • {req.designation}</p>
                    <p className="text-xs text-muted-foreground mt-1">{req.collegeCity} • <a href={req.collegeWebsite} className="text-primary underline">{req.collegeWebsite}</a></p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => approveMutation.mutate(req._id)}
                      disabled={approveMutation.isPending}
                      className="flex items-center gap-1.5 rounded-lg bg-success px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                    >
                      {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                      Approve
                    </button>
                    <button className="flex items-center gap-1.5 rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Platform User Management</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full">
              <thead className="bg-muted/50 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Current Role</th>
                  <th className="px-6 py-4">College</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">User list loading or empty...</td></tr>
                ) : users.map((u: any) => (
                  <tr key={u._id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{u.name}</div>
                      <div className="text-xs text-muted-foreground">{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700 border border-purple-100 uppercase">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{u.collegeName || 'Platform'}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-xs font-bold text-primary hover:underline">Change Role</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-foreground">Platform Announcements</h2>
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm hover:opacity-90">Create New</button>
          </div>
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <Megaphone className="mx-auto h-12 w-12 text-muted-foreground/20" />
            <h3 className="mt-4 font-heading font-semibold text-foreground">No recent announcements</h3>
            <p className="mt-1 text-sm text-muted-foreground">Keep the users informed by publishing updates here.</p>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default PlatformAdminDashboard;
