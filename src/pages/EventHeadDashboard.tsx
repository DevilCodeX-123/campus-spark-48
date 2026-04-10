import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  LayoutDashboard, Calendar, Users, DollarSign, BarChart3, LogOut,
  Menu, X, Search, Download, Pencil, Trash2, Loader2, Plus,
  TrendingUp, UserCheck, Target, CheckCircle2, AlertCircle
} from 'lucide-react';

const NAV = [
  { id: 'events',        label: 'My Events',        icon: Calendar },
  { id: 'team',          label: 'Team Management',  icon: Users },
  { id: 'budget',        label: 'Budget Manager',   icon: DollarSign },
  { id: 'registrations', label: 'Registrations',    icon: UserCheck },
  { id: 'analytics',    label: 'Analytics',        icon: BarChart3 },
];

const BUDGET_CATEGORIES = [
  { key: 'venue',      label: 'Venue & Hall',     color: 'bg-teal-500',   allocated: 30 },
  { key: 'food',       label: 'Food & Catering',  color: 'bg-emerald-500', allocated: 20 },
  { key: 'decoration', label: 'Decoration',       color: 'bg-cyan-500',   allocated: 15 },
  { key: 'marketing',  label: 'Marketing & PR',   color: 'bg-green-500',  allocated: 15 },
  { key: 'prizes',     label: 'Prizes & Awards',  color: 'bg-lime-500',   allocated: 15 },
  { key: 'misc',       label: 'Miscellaneous',    color: 'bg-teal-400',   allocated: 5 },
];

const EventHeadDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('events');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [regSearch, setRegSearch] = useState('');
  const [totalBudget, setTotalBudget] = useState(100000);
  const [allocations, setAllocations] = useState<Record<string, number>>(
    Object.fromEntries(BUDGET_CATEGORIES.map(c => [c.key, c.allocated]))
  );

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['eh_events', user?.collegeId],
    queryFn: () => api.get(`/events?collegeId=${user?.collegeId}`).then(r => r.data).catch(() => []),
    enabled: !!user?.collegeId,
  });

  const { data: registrations = [], isLoading: loadingRegs } = useQuery({
    queryKey: ['eh_regs'],
    queryFn: () => api.get('/register/all').then(r => r.data).catch(() => []),
  });

  const allEvents = Array.isArray(events) ? events : [];
  const allRegs = Array.isArray(registrations) ? registrations : [];

  const filteredRegs = allRegs.filter((r: any) =>
    (r.userName || '').toLowerCase().includes(regSearch.toLowerCase()) ||
    (r.userEmail || '').toLowerCase().includes(regSearch.toLowerCase())
  );

  const totalAllocated = Object.values(allocations).reduce((a, b) => a + b, 0);
  const spent = Math.round(totalBudget * 0.42); // Mock 42% spend
  const remaining = totalBudget - spent;

  const handleLogout = () => { logout(); navigate('/'); };

  const mockTeam = [
    { id: 1, name: 'Arjun Sharma', role: 'Event Assistant', events: 'CodeRed Hackathon', status: 'active' },
    { id: 2, name: 'Priya Mehra', role: 'Event Assistant', events: 'AI Summit 2026', status: 'active' },
    { id: 3, name: 'Ravi Kumar', role: 'Event Assistant', events: 'CodeRed Hackathon', status: 'inactive' },
  ];

  return (
    <div className="flex min-h-screen" style={{ background: '#071a19' }}>
      {/* ──── SIDEBAR ──── */}
      <aside className={`admin-sidebar head-sidebar transition-all duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-teal-500/15">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 border border-teal-500/30">
            <Target className="h-5 w-5 text-teal-400" />
          </div>
          <div>
            <p className="text-sm font-black text-white">Event Head</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-teal-400">{user?.college || 'CampusConnect'}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`sidebar-link w-full ${isActive ? 'head-link-active' : 'head-link'}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-teal-500/15 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-teal-500/10 px-3 py-3 border border-teal-500/15">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-500/20 text-sm font-black text-teal-400 border border-teal-500/30">
              {user?.name?.charAt(0) || 'E'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-teal-300/50 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-teal-300/50 hover:text-teal-300 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ──── MAIN ──── */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b backdrop-blur-xl" style={{ background: 'rgba(7,26,25,0.95)', borderColor: 'rgba(20,184,166,0.15)' }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-teal-400/50 hover:text-teal-400 transition-colors">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-lg font-black text-white">{NAV.find(n => n.id === activeTab)?.label}</h1>
              <p className="text-xs text-teal-400/60">Event Head Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-full bg-teal-500/10 border border-teal-500/20 px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></div>
              <span className="text-xs font-bold text-teal-400">Event Head</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6" style={{ background: '#071a19' }}>

          {/* ── MY EVENTS ── */}
          {activeTab === 'events' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-black text-white">My Events</h2>
                <button onClick={() => toast.info('Event creation — contact your College Admin')} className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20">
                  <Plus className="h-4 w-4" /> New Event
                </button>
              </div>
              {loadingEvents ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-teal-400" /></div>
              ) : allEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-teal-500/15 py-20" style={{ background: 'rgba(20,184,166,0.03)' }}>
                  <Calendar className="h-12 w-12 text-teal-500/30 mb-3" />
                  <p className="text-teal-300/60">No events assigned. Contact your College Admin.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {allEvents.map((e: any) => (
                    <div key={e._id} className="group rounded-2xl border border-teal-500/15 p-5 hover:border-teal-500/40 transition-all hover:-translate-y-1" style={{ background: 'rgba(20,184,166,0.05)' }}>
                      <div className="relative h-28 rounded-xl overflow-hidden mb-4" style={{ background: 'rgba(20,184,166,0.1)' }}>
                        {e.coverImage && <img src={e.coverImage} alt={e.title} className="absolute inset-0 h-full w-full object-cover opacity-80" />}
                        <div className="absolute top-2 right-2">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${e.status === 'ongoing' ? 'bg-green-500/20 text-green-400' : e.status === 'completed' ? 'bg-slate-500/20 text-slate-400' : 'bg-teal-500/20 text-teal-400'}`}>{e.status || 'upcoming'}</span>
                        </div>
                      </div>
                      <h3 className="font-heading font-bold text-white">{e.title}</h3>
                      <p className="mt-1 text-sm text-teal-300/60">{e.date} · {e.venue || 'TBA'}</p>
                      <p className="mt-1 text-xs text-teal-300/40">{e.seatsLeft ?? e.capacity} / {e.capacity} seats</p>
                      <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="flex items-center gap-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20 px-3 py-1.5 text-xs font-bold text-teal-400 hover:bg-teal-500/20 transition-colors">
                          <Pencil className="h-3 w-3" /> Edit
                        </button>
                        <button className="flex items-center gap-1.5 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-1.5 text-xs font-bold text-red-400 hover:bg-red-500/20 transition-colors">
                          <Trash2 className="h-3 w-3" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── TEAM MANAGEMENT ── */}
          {activeTab === 'team' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-black text-white">Team Management</h2>
                <button onClick={() => toast.info('Invite sent!')} className="flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-2.5 text-sm font-bold text-white hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/20">
                  <Plus className="h-4 w-4" /> Add Assistant
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {mockTeam.map(member => (
                  <div key={member.id} className="rounded-2xl border border-teal-500/15 p-5" style={{ background: 'rgba(20,184,166,0.05)' }}>
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-500/15 border border-teal-500/25 text-2xl font-black text-teal-400">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-white">{member.name}</p>
                        <p className="text-xs text-teal-300/60 mt-0.5">{member.role}</p>
                      </div>
                    </div>
                    <div className="mt-4 rounded-lg bg-teal-500/5 border border-teal-500/10 px-3 py-2 text-xs text-teal-300/70">
                      Assigned: {member.events}
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${member.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${member.status === 'active' ? 'bg-green-400' : 'bg-slate-400'}`}></span>
                        {member.status}
                      </span>
                      <button className="text-xs text-red-400/60 hover:text-red-400 transition-colors">Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── BUDGET MANAGER ── */}
          {activeTab === 'budget' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <h2 className="font-heading text-xl font-black text-white">Budget Manager</h2>

              {/* Budget summary cards */}
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Total Budget',   value: `₹${totalBudget.toLocaleString()}`, color: 'text-teal-400',   border: 'border-teal-500/20', bg: 'rgba(20,184,166,0.05)' },
                  { label: 'Spent So Far',   value: `₹${spent.toLocaleString()}`,       color: 'text-orange-400', border: 'border-orange-500/20', bg: 'rgba(249,115,22,0.05)' },
                  { label: 'Remaining',      value: `₹${remaining.toLocaleString()}`,   color: remaining > totalBudget * 0.3 ? 'text-green-400' : 'text-red-400', border: remaining > totalBudget * 0.3 ? 'border-green-500/20' : 'border-red-500/20', bg: remaining > totalBudget * 0.3 ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)' },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl border p-6" style={{ background: s.bg, borderColor: s.border.replace('border-', '') }}>
                    <p className="text-xs font-bold uppercase tracking-widest text-teal-300/50">{s.label}</p>
                    <p className={`mt-2 text-3xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Total budget input */}
              <div className="rounded-2xl border border-teal-500/15 p-6" style={{ background: 'rgba(20,184,166,0.05)' }}>
                <label className="text-xs font-bold uppercase tracking-widest text-teal-400">Set Total Budget (₹)</label>
                <div className="mt-3 flex items-center gap-4">
                  <input type="number" value={totalBudget} onChange={e => setTotalBudget(Number(e.target.value))}
                    className="flex-1 max-w-xs rounded-xl border border-teal-500/20 px-4 py-3 text-xl font-black text-white focus:outline-none focus:border-teal-400"
                    style={{ background: 'rgba(20,184,166,0.07)' }}
                  />
                  <button onClick={() => toast.success('Budget saved!')} className="rounded-xl bg-teal-500 px-6 py-3 font-bold text-white text-sm hover:bg-teal-400 transition-all">
                    Save Budget
                  </button>
                </div>
              </div>

              {/* Category Allocations */}
              <div className="rounded-2xl border border-teal-500/15 p-6" style={{ background: 'rgba(20,184,166,0.03)' }}>
                <h3 className="font-bold text-white mb-6">Category Allocations (%)</h3>
                <div className="space-y-5">
                  {BUDGET_CATEGORIES.map(cat => {
                    const pct = allocations[cat.key] || 0;
                    const amount = Math.round((pct / 100) * totalBudget);
                    return (
                      <div key={cat.key}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-semibold text-teal-200/80">{cat.label}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-teal-400/60">₹{amount.toLocaleString()}</span>
                            <span className="text-sm font-black text-teal-400 w-10 text-right">{pct}%</span>
                          </div>
                        </div>
                        <input type="range" min={0} max={100} value={pct}
                          onChange={e => setAllocations(prev => ({ ...prev, [cat.key]: Number(e.target.value) }))}
                          className="w-full accent-teal-400 cursor-pointer"
                        />
                        <div className="mt-1 h-2 w-full rounded-full bg-teal-500/10">
                          <div className={`h-2 rounded-full ${cat.color} transition-all duration-300`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className={`mt-6 rounded-xl border p-4 flex items-center gap-3 ${totalAllocated > 100 ? 'border-red-500/30 bg-red-500/5' : 'border-green-500/20 bg-green-500/5'}`}>
                  {totalAllocated > 100 ? <AlertCircle className="h-5 w-5 text-red-400 shrink-0" /> : <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />}
                  <div>
                    <p className={`font-bold text-sm ${totalAllocated > 100 ? 'text-red-400' : 'text-green-400'}`}>
                      Total Allocated: {totalAllocated}% {totalAllocated > 100 && '— Over budget!'}
                    </p>
                    <p className="text-xs text-teal-300/50 mt-0.5">Adjust sliders to keep total at or below 100%</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── REGISTRATIONS ── */}
          {activeTab === 'registrations' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-heading text-xl font-black text-white">Registrations ({allRegs.length})</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-teal-400/40" />
                    <input value={regSearch} onChange={e => setRegSearch(e.target.value)} placeholder="Search participants..."
                      className="rounded-xl border border-teal-500/20 pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-teal-400/30 focus:outline-none focus:border-teal-400/60 w-64"
                      style={{ background: 'rgba(20,184,166,0.07)' }}
                    />
                  </div>
                  <button onClick={() => toast.success('CSV Export — coming soon!')} className="flex items-center gap-2 rounded-xl border border-teal-500/30 bg-teal-500/10 px-4 py-2.5 text-sm font-bold text-teal-400 hover:bg-teal-500/20 transition-colors">
                    <Download className="h-4 w-4" /> Export CSV
                  </button>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-teal-500/15" style={{ background: 'rgba(20,184,166,0.03)' }}>
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-teal-500/10">
                      {['Participant', 'Email', 'Event', 'Date', 'Check-In'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-teal-400/50">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-500/5">
                    {loadingRegs ? (
                      <tr><td colSpan={5} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-teal-400 mx-auto" /></td></tr>
                    ) : filteredRegs.length === 0 ? (
                      <tr><td colSpan={5} className="py-12 text-center text-teal-300/40 text-sm">No registrations found</td></tr>
                    ) : filteredRegs.slice(0, 50).map((r: any) => (
                      <tr key={r._id} className="hover:bg-teal-500/3 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-teal-500/15 flex items-center justify-center text-xs font-black text-teal-400">
                              {(r.userName || 'U').charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-white">{r.userName || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-teal-300/60">{r.userEmail || '—'}</td>
                        <td className="px-6 py-4 text-sm text-teal-300/70 font-medium">{r.eventTitle || '—'}</td>
                        <td className="px-6 py-4 text-xs text-teal-300/40">{r.registeredAt ? new Date(r.registeredAt).toLocaleDateString() : '—'}</td>
                        <td className="px-6 py-4">
                          <span className={`rounded-full px-3 py-1 text-xs font-bold ${r.checkedIn ? 'bg-green-500/10 text-green-400' : 'bg-teal-500/10 text-teal-400'}`}>
                            {r.checkedIn ? 'Checked In' : 'Pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <h2 className="font-heading text-xl font-black text-white">Event Analytics</h2>
              
              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: 'Total Registrations', value: allRegs.length, color: 'text-teal-400' },
                  { label: 'Events Managed',       value: allEvents.length, color: 'text-emerald-400' },
                  { label: 'Avg Fill Rate',        value: allEvents.length > 0 ? `${Math.round(Math.random() * 50 + 40)}%` : '—', color: 'text-cyan-400' },
                ].map(s => (
                  <div key={s.label} className="rounded-2xl border border-teal-500/15 p-6" style={{ background: 'rgba(20,184,166,0.05)' }}>
                    <p className="text-xs font-bold uppercase tracking-widest text-teal-400/50">{s.label}</p>
                    <p className={`mt-2 text-3xl font-black ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Bar chart — visual only */}
              <div className="rounded-2xl border border-teal-500/15 p-6" style={{ background: 'rgba(20,184,166,0.03)' }}>
                <h3 className="font-bold text-white mb-6 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-teal-400" /> Registrations by Event</h3>
                <div className="space-y-4">
                  {allEvents.slice(0, 6).map((e: any, i: number) => {
                    const count = Math.floor(Math.random() * 150 + 20);
                    const maxCount = 200;
                    const pct = (count / maxCount) * 100;
                    return (
                      <div key={e._id}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-teal-200/80 font-semibold truncate max-w-[200px]">{e.title}</span>
                          <span className="text-teal-400 font-bold ml-4">{count}</span>
                        </div>
                        <div className="h-3 w-full rounded-full bg-teal-500/10">
                          <div className={`h-3 rounded-full ${['bg-teal-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-green-500', 'bg-lime-500', 'bg-teal-400'][i % 6]} transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {allEvents.length === 0 && <p className="text-center text-teal-400/40 py-8">No events to analyze yet.</p>}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default EventHeadDashboard;
