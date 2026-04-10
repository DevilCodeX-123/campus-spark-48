import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { Calendar, QrCode, Users, Settings, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const OrganizerHelperPanel: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('events');
  const [qrInput, setQrInput] = useState('');
  const queryClient = useQueryClient();

  // Queries
  const { data: events, isLoading: isLoadingEvents } = useQuery({
    queryKey: ['helperEvents', user?.id],
    queryFn: async () => {
      // In a real microservice, we'd have a specific endpoint for helper's assigned events
      const res = await api.get(`/events?collegeId=${user?.collegeId}`);
      return res.data.filter((e: any) => e.teamMembers?.includes(user?.id) || user?.assignedEvents?.includes(e._id));
    },
    enabled: !!user?.id
  });

  // Check-in Mutation
  const checkinMutation = useMutation({
    mutationFn: async (qrCode: string) => {
      return api.post('/register/checkin', { qrCode });
    },
    onSuccess: (data) => {
      toast.success(data.data.message || 'Check-in successful');
      setQrInput('');
      queryClient.invalidateQueries({ queryKey: ['eventAttendees'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  });

  // Event Status Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ eventId, status }: { eventId: string, status: string }) => {
      return api.put(`/events/${eventId}`, { status });
    },
    onSuccess: () => {
      toast.success('Event status updated');
      queryClient.invalidateQueries({ queryKey: ['helperEvents'] });
    }
  });

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput) return;
    checkinMutation.mutate(qrInput);
  };

  const tabs = [
    { id: 'events', label: 'My Events', icon: <Calendar className="h-4 w-4" /> },
    { id: 'scanner', label: 'QR Scanner', icon: <QrCode className="h-4 w-4" /> },
    { id: 'status', label: 'Event Status', icon: <Settings className="h-4 w-4" /> },
  ];

  return (
    <DashboardLayout role="helper" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-foreground">My Assigned Events</h2>
            {isLoadingEvents && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
          </div>
          
          {!events || events.length === 0 ? (
            <div className="flex h-48 items-center justify-center rounded-xl border border-dashed border-border bg-card">
              <p className="text-muted-foreground">No events assigned to you yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((e: any) => (
                <div key={e._id} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="font-heading font-semibold text-foreground">{e.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{e.date} • {e.time}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{e.venue}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{e.category}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      e.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 
                      e.status === 'ongoing' ? 'bg-green-100 text-green-700 animate-pulse' : 
                      'bg-gray-100 text-gray-700'
                    }`}>{e.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'scanner' && (
        <div className="space-y-6">
          <h2 className="font-heading text-xl font-semibold text-foreground">Attendance Check-in</h2>
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
            <div className="mb-6 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <QrCode className="h-10 w-10 text-primary" />
              </div>
            </div>
            <form onSubmit={handleScan} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Scan or Enter QR Code</label>
                <input
                  type="text"
                  value={qrInput}
                  onChange={e => setQrInput(e.target.value)}
                  placeholder="CC-EVENT-USER-ID"
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  autoFocus
                />
              </div>
              <button 
                type="submit"
                disabled={checkinMutation.isPending}
                className="w-full rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground hover:opacity-90 disabled:opacity-50 transition-all"
              >
                {checkinMutation.isPending ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : 'Confirm Check-in'}
              </button>
            </form>
          </div>
        </div>
      )}

      {activeTab === 'status' && (
        <div className="space-y-4">
          <h2 className="font-heading text-xl font-semibold text-foreground">Update Event Status</h2>
          <div className="grid gap-4">
            {events?.map((e: any) => (
              <div key={e._id} className="flex items-center justify-between rounded-xl border border-border bg-card p-5 shadow-sm">
                <div>
                  <h3 className="font-heading font-semibold text-foreground">{e.title}</h3>
                  <p className="text-xs text-muted-foreground">Current: <span className="capitalize">{e.status}</span></p>
                </div>
                <div className="flex gap-2">
                  <select 
                    className="rounded-lg border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    defaultValue={e.status}
                    onChange={(evt) => statusMutation.mutate({ eventId: e._id, status: evt.target.value })}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default OrganizerHelperPanel;
