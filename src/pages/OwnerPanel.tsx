import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { Shield, Building2, Users, Calendar, AlertTriangle, CheckCircle, XCircle, Activity, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const OwnerPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('requests');
  const queryClient = useQueryClient();

  // Queries
  const { data: requests, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: async () => {
      const res = await api.get('/owner/requests', {
        headers: { 'x-owner-secret-key': 'ownerpass2024' }
      });
      return res.data;
    },
    enabled: activeTab === 'requests'
  });

  const { data: colleges, isLoading: isLoadingColleges } = useQuery({
    queryKey: ['allColleges'],
    queryFn: async () => {
      const res = await api.get('/auth/colleges');
      return res.data;
    },
    enabled: activeTab === 'colleges' || activeTab === 'analytics'
  });

  // Mutations
  const approveMutation = useMutation({
    mutationFn: async (requestId: string) => {
      return api.post(`/owner/approve/${requestId}`, {}, {
        headers: { 'x-owner-secret-key': 'ownerpass2024' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      toast.success('College approved successfully');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Approval failed');
    }
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ requestId, reason }: { requestId: string, reason: string }) => {
      return api.post(`/owner/reject/${requestId}`, { reason }, {
        headers: { 'x-owner-secret-key': 'ownerpass2024' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingRequests'] });
      toast.success('Request rejected');
    }
  });

  if (!user || user.role !== 'owner') {
    return <Navigate to="/login" />;
  }

  const tabs = [
    { id: 'requests', label: 'Pending Requests', icon: <AlertTriangle className="h-4 w-4" /> },
    { id: 'colleges', label: 'All Colleges', icon: <Building2 className="h-4 w-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <Activity className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout role="owner" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-foreground">Pending College Admin Requests</h2>
            {isLoadingRequests && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          </div>
          
          {!requests || requests.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50">
              <CheckCircle className="mb-2 h-10 w-10 text-muted-foreground/30" />
              <p className="text-muted-foreground">No pending requests at the moment</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {requests.map((req: any) => (
                <div key={req._id} className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground">{req.collegeName}</h3>
                      <p className="text-sm text-muted-foreground">{req.collegeCity}</p>
                    </div>
                    <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-500">Pending Review</span>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Applicant:</span> <span className="font-medium text-foreground">{req.name}</span></p>
                    <p><span className="text-muted-foreground">Email:</span> <span className="text-foreground">{req.email}</span></p>
                    <p><span className="text-muted-foreground">Designation:</span> <span className="text-foreground">{req.designation}</span></p>
                    <p><span className="text-muted-foreground">Website:</span> <a href={req.collegeWebsite} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{req.collegeWebsite}</a></p>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => approveMutation.mutate(req._id)}
                      disabled={approveMutation.isPending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {approveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} 
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        const reason = prompt('Reason for rejection:');
                        if (reason) rejectMutation.mutate({ requestId: req._id, reason });
                      }}
                      disabled={rejectMutation.isPending}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                    >
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
          <h2 className="font-heading text-xl font-semibold text-foreground">Registered Colleges</h2>
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">College Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {colleges?.map((c: any) => (
                  <tr key={c._id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">{c.name}</div>
                      <div className="text-xs text-muted-foreground">{c.website}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">{c.city}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {c.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-sm font-medium text-destructive hover:underline">Suspend</button>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard label="Total Colleges" value={colleges?.length || 0} icon={<Building2 className="h-5 w-5" />} color="red" />
            <StatCard label="Active Requests" value={requests?.length || 0} icon={<AlertTriangle className="h-5 w-5" />} color="red" />
            <StatCard label="System Status" value="Online" icon={<Activity className="h-5 w-5" />} color="red" />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OwnerPanel;
