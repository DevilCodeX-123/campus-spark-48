import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  LayoutDashboard, Building2, Users, Calendar, Megaphone, Shield,
  Activity, CheckCircle, XCircle, Loader2, Search, ChevronRight,
  AlertTriangle, Trash2, LogOut, Menu, X, Wifi, WifiOff, Server,
  TrendingUp, Globe
} from 'lucide-react';

/* ─── Sidebar link data ─── */
const NAV = [
  { id: 'overview',    label: 'Control Center', icon: LayoutDashboard },
  { id: 'requests',   label: 'College Requests', icon: AlertTriangle },
  { id: 'users',      label: 'All Users',        icon: Users },
  { id: 'colleges',   label: 'All Colleges',     icon: Building2 },
  { id: 'events',     label: 'All Events',       icon: Calendar },
  { id: 'announce',   label: 'Announcements',    icon: Megaphone },
  { id: 'health',     label: 'System Health',    icon: Activity },
];

const SERVICES = [
  { name: 'Auth Service',         port: 3001, status: 'online' },
  { name: 'Event Service',        port: 3002, status: 'online' },
  { name: 'Registration Service', port: 3003, status: 'online' },
  { name: 'MongoDB Atlas',        port: null,  status: 'online' },
  { name: 'API Gateway',          port: 5000,  status: 'online' },
];

const PlatformAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({});
  const [userSearch, setUserSearch] = useState('');
  const [announcement, setAnnouncement] = useState({ title: '', content: '' });
  const [announcements, setAnnouncements] = useState<any[]>([]);

  /* ─── Queries ─── */
  const { data: colleges = [], isLoading: loadingColleges } = useQuery({
    queryKey: ['admin_colleges'],
    queryFn: () => api.get('/auth/colleges').then(r => r.data),
  });

  const { data: requests = [], isLoading: loadingRequests } = useQuery({
    queryKey: ['admin_requests'],
    queryFn: () => api.get('/owner/requests', { headers: { 'x-owner-secret-key': 'ownerpass2024' } }).then(r => r.data),
  });

  const { data: users = [], isLoading: loadingUsers } = useQuery({
    queryKey: ['admin_users'],
    queryFn: () => api.get('/auth/users').then(r => r.data).catch(() => []),
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['admin_events'],
    queryFn: () => api.get('/events').then(r => r.data).catch(() => []),
  });

  /* ─── Mutations ─── */
  const approveMut = useMutation({
    mutationFn: (id: string) => api.post(`/owner/approve/${id}`, {}, { headers: { 'x-owner-secret-key': 'ownerpass2024' } }),
    onSuccess: () => { toast.success('College approved!'); queryClient.invalidateQueries({ queryKey: ['admin_requests'] }); queryClient.invalidateQueries({ queryKey: ['admin_colleges'] }); },
    onError: () => toast.error('Approval failed'),
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      api.post(`/owner/reject/${id}`, { reason }, { headers: { 'x-owner-secret-key': 'ownerpass2024' } }),
    onSuccess: () => { toast.success('Request rejected'); queryClient.invalidateQueries({ queryKey: ['admin_requests'] }); },
    onError: () => toast.error('Rejection failed'),
  });

  const filteredUsers = users.filter((u: any) =>
    (u.name || '').toLowerCase().includes(userSearch.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(userSearch.toLowerCase())
  );

  const handleLogout = () => { logout(); navigate('/'); };

  const pendingReqs = requests.filter((r: any) => r.status === 'pending');

  /* ─── Stat summary ─── */
  const stats = [
    { label: 'Total Colleges',   value: colleges.length,     icon: Building2,  color: 'from-red-500/20 to-red-600/10', border: 'border-red-500/20', text: 'text-red-400' },
    { label: 'Registered Users', value: users.length || '—', icon: Users,       color: 'from-orange-500/20 to-orange-600/10', border: 'border-orange-500/20', text: 'text-orange-400' },
    { label: 'Total Events',     value: Array.isArray(events) ? events.length : '—', icon: Calendar, color: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', text: 'text-purple-400' },
    { label: 'Pending Requests', value: pendingReqs.length,  icon: AlertTriangle, color: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/20', text: 'text-yellow-400' },
  ];

  return (
    <div className="flex min-h-screen admin-dark">
      {/* ──── SIDEBAR ──── */}
      <aside className={`admin-sidebar admin-dark-sidebar transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-red-500/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 border border-red-500/30">
            <Shield className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <p className="text-sm font-black text-white tracking-wide">CampusConnect</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-red-400">Super Admin</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`sidebar-link w-full ${isActive ? 'admin-dark-link-active' : 'admin-dark-link'}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
                {item.id === 'requests' && pendingReqs.length > 0 && (
                  <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-black text-white">
                    {pendingReqs.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile at bottom */}
        <div className="border-t border-red-500/10 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-white/5 px-3 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-500/20 text-sm font-black uppercase text-red-400 border border-red-500/30">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ──── MAIN CONTENT ──── */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#090b10]/95 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-white transition-colors">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-lg font-black text-white">{NAV.find(n => n.id === activeTab)?.label}</h1>
              <p className="text-xs text-slate-500">Super Admin Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-3 py-1.5">
              <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse"></div>
              <span className="text-xs font-bold text-red-400">GOD MODE</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 space-y-6">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className={`relative overflow-hidden rounded-2xl border ${s.border} bg-gradient-to-br ${s.color} p-6 glow-red`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{s.label}</p>
                          <p className={`mt-2 text-4xl font-black ${s.text}`}>{s.value}</p>
                        </div>
                        <div className={`rounded-xl bg-white/5 p-3 ${s.text}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Active colleges table */}
              <div className="rounded-2xl border border-white/5 bg-white/3 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
                  <h3 className="font-heading font-bold text-white flex items-center gap-2"><Globe className="h-4 w-4 text-red-400" /> Active Colleges</h3>
                  <span className="text-xs text-slate-500">{colleges.length} total</span>
                </div>
                <div className="divide-y divide-white/5">
                  {loadingColleges ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-red-400" /></div>
                  ) : colleges.slice(0, 8).map((c: any) => (
                    <div key={c._id} className="flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-sm font-black text-red-400">
                          {(c.name || 'C').charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-sm">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.city} • {c.adminId ? 'Admin assigned' : 'No admin'}</p>
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${c.isActive !== false ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${c.isActive !== false ? 'bg-green-400' : 'bg-red-400'}`}></span>
                        {c.isActive !== false ? 'Active' : 'Inactive'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── COLLEGE REQUESTS ── */}
          {activeTab === 'requests' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-black text-white">College Registration Requests</h2>
                <span className="rounded-full bg-red-500/15 border border-red-500/20 px-3 py-1 text-sm font-bold text-red-400">{pendingReqs.length} Pending</span>
              </div>

              {loadingRequests ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-red-400" /></div>
              ) : pendingReqs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-white/5 py-20">
                  <CheckCircle className="h-16 w-16 text-green-500/30" />
                  <p className="mt-4 font-heading font-bold text-white">All Caught Up!</p>
                  <p className="text-sm text-slate-500">No pending college requests.</p>
                </div>
              ) : pendingReqs.map((req: any) => (
                <div key={req._id} className="rounded-2xl border border-white/8 bg-white/3 p-6 hover:border-red-500/20 transition-all">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-lg font-black text-red-400">
                          {(req.collegeName || 'C').charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-heading font-bold text-white">{req.collegeName}</h3>
                          <p className="text-xs text-slate-400">{req.name} · {req.designation}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                        <div><span className="text-slate-500 text-xs uppercase tracking-wider">City</span><p className="text-slate-300 font-medium">{req.collegeCity}</p></div>
                        <div><span className="text-slate-500 text-xs uppercase tracking-wider">Email</span><p className="text-slate-300 font-medium truncate">{req.email}</p></div>
                        <div className="col-span-2"><span className="text-slate-500 text-xs uppercase tracking-wider">Website</span><a href={req.collegeWebsite} target="_blank" rel="noreferrer" className="text-red-400 hover:underline font-medium text-sm">{req.collegeWebsite}</a></div>
                      </div>
                      <div className="mt-4">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Rejection Reason (if rejecting)</label>
                        <textarea
                          rows={2}
                          value={rejectReason[req._id] || ''}
                          onChange={e => setRejectReason(prev => ({ ...prev, [req._id]: e.target.value }))}
                          placeholder="State the reason for rejection..."
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/50 resize-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => approveMut.mutate(req._id)}
                        disabled={approveMut.isPending}
                        className="flex items-center gap-2 rounded-xl bg-green-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-green-400 transition-all shadow-lg shadow-green-500/20 disabled:opacity-50"
                      >
                        {approveMut.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
                        Approve
                      </button>
                      <button
                        onClick={() => rejectMut.mutate({ id: req._id, reason: rejectReason[req._id] || 'No reason provided' })}
                        disabled={rejectMut.isPending}
                        className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-50"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── USERS ── */}
          {activeTab === 'users' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-heading text-xl font-black text-white">Platform Users</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input
                    value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    placeholder="Search users..."
                    className="rounded-xl border border-white/10 bg-white/5 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/40 w-64"
                  />
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['User', 'Role', 'College', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingUsers ? (
                      <tr><td colSpan={5} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-red-400 mx-auto" /></td></tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-slate-500 text-sm">No users found</td></tr>
                    ) : filteredUsers.slice(0, 50).map((u: any) => (
                      <tr key={u._id} className="hover:bg-white/3 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xs font-black text-red-400">
                              {(u.name || 'U').charAt(0)}
                            </div>
                            <div>
                              <p className="font-semibold text-white text-sm">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase ${u.role === 'website_admin' ? 'bg-red-500/15 text-red-400' : u.role === 'college_admin' ? 'bg-blue-500/15 text-blue-400' : u.role === 'event_head' ? 'bg-teal-500/15 text-teal-400' : u.role === 'helper' ? 'bg-yellow-500/15 text-yellow-400' : 'bg-slate-500/15 text-slate-400'}`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{u.collegeName || '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`flex items-center gap-1.5 text-xs font-bold ${u.isActive !== false ? 'text-green-400' : 'text-red-400'}`}>
                            <span className={`h-1.5 w-1.5 rounded-full ${u.isActive !== false ? 'bg-green-400' : 'bg-red-400'}`}></span>
                            {u.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors">Change Role</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── COLLEGES ── */}
          {activeTab === 'colleges' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <h2 className="font-heading text-xl font-black text-white">All Colleges ({colleges.length})</h2>
              <div className="overflow-hidden rounded-2xl border border-white/8 bg-white/2">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      {['College', 'City', 'Contact', 'Status', 'Actions'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {loadingColleges ? (
                      <tr><td colSpan={5} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-red-400 mx-auto" /></td></tr>
                    ) : colleges.map((c: any) => (
                      <tr key={c._id} className="hover:bg-white/3 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-sm font-black text-red-400">
                              {(c.name || 'C').charAt(0)}
                            </div>
                            <p className="font-semibold text-white text-sm">{c.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-400">{c.city || '—'}</td>
                        <td className="px-6 py-4 text-sm text-slate-400 truncate max-w-32">{c.adminId || 'Unassigned'}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${c.isActive !== false ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                            {c.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Toggle</button>
                            <button className="text-xs font-bold text-red-500 hover:text-red-400 transition-colors flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── EVENTS ── */}
          {activeTab === 'events' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <h2 className="font-heading text-xl font-black text-white">All Platform Events</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loadingEvents ? (
                  <div className="col-span-3 flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-red-400" /></div>
                ) : !Array.isArray(events) || events.length === 0 ? (
                  <div className="col-span-3 flex flex-col items-center justify-center py-20 text-slate-500">
                    <Calendar className="h-12 w-12 mb-3 opacity-20" />
                    <p>No events found on the platform.</p>
                  </div>
                ) : events.map((e: any) => (
                  <div key={e._id} className="rounded-2xl border border-white/8 bg-white/3 p-5 hover:border-red-500/20 transition-all">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold text-white text-sm line-clamp-1">{e.title}</h3>
                      <span className={`ml-2 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${e.status === 'ongoing' ? 'bg-green-500/15 text-green-400' : e.status === 'completed' ? 'bg-slate-500/15 text-slate-400' : e.status === 'cancelled' ? 'bg-red-500/15 text-red-400' : 'bg-blue-500/15 text-blue-400'}`}>{e.status || 'upcoming'}</span>
                    </div>
                    <p className="mt-1 text-xs text-slate-400">{e.collegeName}</p>
                    <p className="mt-2 text-xs text-slate-500">{e.date} · {e.venue || 'TBA'}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${e.isFree ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'}`}>{e.isFree ? 'FREE' : `₹${e.price}`}</span>
                      <span className="text-xs text-slate-600">{e.seatsLeft ?? e.capacity} seats</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ANNOUNCEMENTS ── */}
          {activeTab === 'announce' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <h2 className="font-heading text-xl font-black text-white">Platform Announcements</h2>
              <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Megaphone className="h-4 w-4 text-red-400" /> Create Announcement</h3>
                <div className="space-y-4">
                  <input
                    type="text" placeholder="Announcement title..."
                    value={announcement.title} onChange={e => setAnnouncement(p => ({ ...p, title: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/40 text-sm"
                  />
                  <textarea
                    rows={5} placeholder="Write your announcement content here..."
                    value={announcement.content} onChange={e => setAnnouncement(p => ({ ...p, content: e.target.value }))}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:border-red-500/40 text-sm resize-none"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        if (!announcement.title.trim()) return toast.error('Title required');
                        setAnnouncements(p => [{ id: Date.now(), ...announcement, createdAt: new Date().toISOString() }, ...p]);
                        setAnnouncement({ title: '', content: '' });
                        toast.success('Announcement published!');
                      }}
                      className="rounded-xl bg-red-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-red-400 transition-all shadow-lg shadow-red-500/20"
                    >
                      Publish Announcement
                    </button>
                    <button onClick={() => setAnnouncement({ title: '', content: '' })} className="rounded-xl border border-white/10 px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-white transition-colors">
                      Clear
                    </button>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {announcements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 py-16 text-slate-600">
                    <Megaphone className="h-12 w-12 mb-3 opacity-20" />
                    <p className="text-sm">No announcements yet. Create one above.</p>
                  </div>
                ) : announcements.map((a: any) => (
                  <div key={a.id} className="rounded-2xl border border-white/8 bg-white/3 p-5">
                    <h4 className="font-bold text-white">{a.title}</h4>
                    <p className="mt-2 text-sm text-slate-400">{a.content}</p>
                    <p className="mt-3 text-xs text-slate-600">{new Date(a.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SYSTEM HEALTH ── */}
          {activeTab === 'health' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <h2 className="font-heading text-xl font-black text-white">System Health Monitor</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SERVICES.map(svc => (
                  <div key={svc.name} className={`rounded-2xl border p-6 ${svc.status === 'online' ? 'border-green-500/20 bg-green-500/5 glow-red' : 'border-red-500/30 bg-red-500/5'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`rounded-xl p-2 ${svc.status === 'online' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                          <Server className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-bold text-white text-sm">{svc.name}</p>
                          {svc.port && <p className="text-xs text-slate-500">Port :{svc.port}</p>}
                        </div>
                      </div>
                      <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black ${svc.status === 'online' ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                        {svc.status === 'online' ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                        {svc.status.toUpperCase()}
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-500 mb-1"><span>Uptime</span><span>99.9%</span></div>
                      <div className="h-1.5 w-full rounded-full bg-white/5">
                        <div className={`h-1.5 rounded-full ${svc.status === 'online' ? 'bg-green-400' : 'bg-red-400'}`} style={{ width: svc.status === 'online' ? '99.9%' : '0%' }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-white/8 bg-white/3 p-6">
                <h3 className="font-bold text-white mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-red-400" /> Platform Activity Feed</h3>
                <div className="space-y-3">
                  {[
                    { msg: 'New college registration request received', time: '2 min ago', type: 'info' },
                    { msg: 'Event "CodeRed Hackathon" published by MIT', time: '18 min ago', type: 'success' },
                    { msg: 'Student account created: johndoe@iit.ac.in', time: '1 hr ago', type: 'info' },
                    { msg: 'Registration service health check passed', time: '2 hr ago', type: 'success' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3">
                      <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${item.type === 'success' ? 'bg-green-400' : 'bg-blue-400'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-300">{item.msg}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default PlatformAdminDashboard;
