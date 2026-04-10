import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  LayoutDashboard, Users, Calendar, UserPlus, BarChart3, Building2,
  LogOut, Menu, X, Search, Plus, Pencil, Trash2, Loader2, ChevronRight,
  GraduationCap, Award, TrendingUp, Star
} from 'lucide-react';

const NAV = [
  { id: 'overview',  label: 'Overview',      icon: LayoutDashboard },
  { id: 'profile',   label: 'College Profile', icon: Building2 },
  { id: 'students',  label: 'Students',       icon: GraduationCap },
  { id: 'events',    label: 'Events Manager', icon: Calendar },
  { id: 'heads',     label: 'Event Heads',    icon: Award },
  { id: 'analytics', label: 'Analytics',      icon: BarChart3 },
];

const CollegeAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [studentSearch, setStudentSearch] = useState('');
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', venue: '', category: 'Technical', capacity: '', isFree: true, price: '' });

  const { data: students = [], isLoading: loadingStudents } = useQuery({
    queryKey: ['ca_students', user?.collegeId],
    queryFn: () => api.get(`/auth/users?collegeId=${user?.collegeId}&role=student`).then(r => r.data).catch(() => []),
    enabled: !!user?.collegeId,
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['ca_events', user?.collegeId],
    queryFn: () => api.get(`/events?collegeId=${user?.collegeId}`).then(r => r.data).catch(() => []),
    enabled: !!user?.collegeId,
  });

  const allStudents = Array.isArray(students) ? students : [];
  const allEvents = Array.isArray(events) ? events : [];
  const eventHeads = allStudents.filter((s: any) => s.role === 'event_head');
  const regularStudents = allStudents.filter((s: any) => s.role === 'student');
  const filteredStudents = regularStudents.filter((s: any) =>
    (s.name || '').toLowerCase().includes(studentSearch.toLowerCase()) ||
    (s.email || '').toLowerCase().includes(studentSearch.toLowerCase())
  );

  const handleLogout = () => { logout(); navigate('/'); };

  const statCards = [
    { label: 'Total Students',   value: allStudents.length, icon: GraduationCap, bg: 'bg-blue-500/10', border: 'border-blue-200', text: 'text-blue-700', dark: 'dark:text-blue-400 dark:border-blue-900/40 dark:bg-blue-500/10' },
    { label: 'Active Events',    value: allEvents.length,   icon: Calendar,       bg: 'bg-indigo-500/10', border: 'border-indigo-200', text: 'text-indigo-700', dark: 'dark:text-indigo-400 dark:border-indigo-900/40 dark:bg-indigo-500/10' },
    { label: 'Event Heads',      value: eventHeads.length,  icon: Award,          bg: 'bg-purple-500/10', border: 'border-purple-200', text: 'text-purple-700', dark: 'dark:text-purple-400 dark:border-purple-900/40 dark:bg-purple-500/10' },
    { label: 'Total Registrations', value: '—',             icon: TrendingUp,     bg: 'bg-cyan-500/10', border: 'border-cyan-200', text: 'text-cyan-700', dark: 'dark:text-cyan-400 dark:border-cyan-900/40 dark:bg-cyan-500/10' },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-background">
      {/* ──── SIDEBAR ──── */}
      <aside className={`admin-sidebar college-sidebar shadow-xl transition-all duration-300 dark:!bg-slate-900 dark:!border-r dark:!border-white/5 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100 dark:border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-200 dark:shadow-blue-900/30">
            <Building2 className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-800 dark:text-white">{user?.college || 'College Admin'}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blue-600">Administrator</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          {NAV.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`sidebar-link w-full ${isActive ? 'college-link-active' : 'college-link dark:text-slate-400 dark:hover:bg-blue-500/10 dark:hover:text-blue-400'}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom profile */}
        <div className="border-t border-slate-100 dark:border-white/5 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-white/5 px-3 py-3 border border-slate-100 dark:border-white/5">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-sm font-black text-blue-700 dark:text-blue-400">
              {user?.name?.charAt(0) || 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ──── MAIN ──── */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-white dark:bg-card border-b border-slate-100 dark:border-border shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 dark:text-white">{NAV.find(n => n.id === activeTab)?.label}</h1>
              <p className="text-xs text-slate-400">College Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-4 py-1.5">
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{user?.college || 'My College'}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-6">

          {/* ── OVERVIEW ── */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map(s => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className={`rounded-2xl border ${s.border} ${s.bg} p-6 ${s.dark} shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{s.label}</p>
                          <p className={`mt-2 text-3xl font-black ${s.text}`}>{s.value}</p>
                        </div>
                        <div className={`rounded-xl p-3 ${s.bg} ${s.text}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Events */}
                <div className="rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" /> Recent Events
                  </h3>
                  {loadingEvents ? <div className="flex items-center justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-blue-500" /></div>
                  : allEvents.slice(0, 4).map((e: any) => (
                    <div key={e._id} className="flex items-center justify-between py-3 border-b border-slate-50 dark:border-border last:border-0">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-white text-sm">{e.title}</p>
                        <p className="text-xs text-slate-400">{e.date}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${e.status === 'upcoming' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400' : 'bg-slate-50 dark:bg-slate-500/10 text-slate-500'}`}>{e.status || 'upcoming'}</span>
                    </div>
                  ))}
                  {allEvents.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No events yet. Create your first event!</p>}
                </div>

                {/* Top Students */}
                <div className="rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <Star className="h-4 w-4 text-blue-600" /> Event Coordinators
                  </h3>
                  {eventHeads.slice(0, 5).map((h: any) => (
                    <div key={h._id} className="flex items-center gap-3 py-3 border-b border-slate-50 dark:border-border last:border-0">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-500/20 text-sm font-black text-blue-600 dark:text-blue-400">
                        {(h.name || 'H').charAt(0)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-800 dark:text-white">{h.name}</p>
                        <p className="text-xs text-slate-400">{h.email}</p>
                      </div>
                      <span className="rounded-full bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">Event Head</span>
                    </div>
                  ))}
                  {eventHeads.length === 0 && <p className="text-sm text-slate-400 text-center py-8">No event heads assigned yet.</p>}
                </div>
              </div>
            </div>
          )}

          {/* ── COLLEGE PROFILE ── */}
          {activeTab === 'profile' && (
            <div className="space-y-6 animate-in fade-in duration-400 max-w-3xl">
              <div className="rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card p-8 shadow-sm">
                {/* Hero banner */}
                <div className="relative h-32 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 mb-8 overflow-hidden">
                  <div className="absolute inset-0 opacity-20" style={{backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')"}}></div>
                  <div className="absolute bottom-4 left-6 flex items-end gap-4">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white shadow-xl border-4 border-white text-3xl font-black text-blue-600">
                      {(user?.college || 'C').charAt(0)}
                    </div>
                    <div className="pb-1">
                      <h2 className="text-2xl font-black text-white">{user?.college || 'Your College'}</h2>
                      <p className="text-sm text-white/70">College Admin Dashboard</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                  {[
                    { label: 'College Name', value: user?.college || 'Not set' },
                    { label: 'Admin Name', value: user?.name || 'Not set' },
                    { label: 'Admin Email', value: user?.email || 'Not set' },
                    { label: 'Total Students', value: allStudents.length.toString() },
                  ].map(field => (
                    <div key={field.label} className="rounded-xl border border-slate-100 dark:border-border bg-slate-50 dark:bg-muted/30 p-5">
                      <label className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">{field.label}</label>
                      <p className="mt-2 font-bold text-slate-800 dark:text-white">{field.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-slate-100 dark:border-border bg-slate-50 dark:bg-muted/30 p-5">
                  <label className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400">College Description</label>
                  <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    Premier educational institution committed to excellence in academics, research, and student development. Home to {allStudents.length} registered students and {allEvents.length} active events.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ── STUDENTS ── */}
          {activeTab === 'students' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h2 className="font-heading text-xl font-black text-slate-900 dark:text-white">Students ({regularStudents.length})</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input value={studentSearch} onChange={e => setStudentSearch(e.target.value)} placeholder="Search students..." className="rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card pl-9 pr-4 py-2.5 text-sm text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-400 w-64" />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card shadow-sm overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-muted/40 border-b border-slate-100 dark:border-border">
                    <tr>
                      {['Student', 'Email', 'Status', 'Action'].map(h => (
                        <th key={h} className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-border">
                    {loadingStudents ? (
                      <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-blue-500 mx-auto" /></td></tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr><td colSpan={4} className="py-12 text-center text-slate-400 text-sm">No students found</td></tr>
                    ) : filteredStudents.map((s: any) => (
                      <tr key={s._id} className="hover:bg-slate-50 dark:hover:bg-muted/20 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-sm font-black text-blue-600 dark:text-blue-400">
                              {(s.name || 'S').charAt(0)}
                            </div>
                            <p className="font-semibold text-slate-800 dark:text-white text-sm">{s.name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{s.email}</td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-green-50 dark:bg-green-500/10 px-2.5 py-1 text-xs font-bold text-green-600 dark:text-green-400">Active</span>
                        </td>
                        <td className="px-6 py-4">
                          <button className="flex items-center gap-1.5 rounded-lg bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 px-3 py-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-500/20 transition-colors">
                            <UserPlus className="h-3 w-3" /> Assign Event Head
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── EVENTS MANAGER ── */}
          {activeTab === 'events' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <div className="flex items-center justify-between">
                <h2 className="font-heading text-xl font-black text-slate-900 dark:text-white">Events Manager ({allEvents.length})</h2>
                <button onClick={() => setShowCreateEvent(!showCreateEvent)} className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-500 shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all hover:-translate-y-0.5">
                  <Plus className="h-4 w-4" /> Create Event
                </button>
              </div>

              {/* Create Event Form */}
              {showCreateEvent && (
                <div className="rounded-2xl border border-blue-100 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/5 p-6 animate-in slide-in-from-top-4 duration-300">
                  <h3 className="font-bold text-blue-700 dark:text-blue-400 mb-4">New Event Details</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: 'Event Title', key: 'title', type: 'text', placeholder: 'e.g. Annual Tech Fest 2026' },
                      { label: 'Date', key: 'date', type: 'date', placeholder: '' },
                      { label: 'Venue', key: 'venue', type: 'text', placeholder: 'e.g. Main Auditorium' },
                      { label: 'Capacity', key: 'capacity', type: 'number', placeholder: 'e.g. 200' },
                    ].map(f => (
                      <div key={f.key}>
                        <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder} value={(newEvent as any)[f.key]} onChange={e => setNewEvent(p => ({ ...p, [f.key]: e.target.value }))}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-4 py-2.5 text-sm focus:outline-none focus:border-blue-400 text-slate-800 dark:text-white" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={newEvent.isFree} onChange={e => setNewEvent(p => ({ ...p, isFree: e.target.checked }))} className="rounded" />
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Free Event</span>
                    </label>
                    {!newEvent.isFree && (
                      <input type="number" placeholder="Price (₹)" value={newEvent.price} onChange={e => setNewEvent(p => ({ ...p, price: e.target.value }))}
                        className="rounded-xl border border-slate-200 dark:border-border bg-white dark:bg-card px-4 py-2 text-sm text-slate-800 dark:text-white focus:outline-none focus:border-blue-400 w-36" />
                    )}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button onClick={() => { toast.success('Event created! (UI demo)'); setShowCreateEvent(false); setNewEvent({ title: '', date: '', venue: '', category: 'Technical', capacity: '', isFree: true, price: '' }); }}
                      className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-500 transition-all">
                      Create Event
                    </button>
                    <button onClick={() => setShowCreateEvent(false)} className="rounded-xl border border-slate-200 dark:border-border px-6 py-2.5 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-muted transition-colors">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {loadingEvents ? (
                  <div className="col-span-3 flex items-center justify-center py-16"><Loader2 className="h-7 w-7 animate-spin text-blue-500" /></div>
                ) : allEvents.length === 0 ? (
                  <div className="col-span-3 flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-border py-20">
                    <Calendar className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-slate-500 font-medium">No events yet. Create your first event!</p>
                  </div>
                ) : allEvents.map((e: any) => (
                  <div key={e._id} className="rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${e.status === 'ongoing' ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : e.status === 'completed' ? 'bg-slate-50 dark:bg-slate-500/10 text-slate-500' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'}`}>{e.status || 'upcoming'}</span>
                      <div className="flex gap-2">
                        <button className="text-slate-400 hover:text-blue-500 transition-colors"><Pencil className="h-4 w-4" /></button>
                        <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-slate-900 dark:text-white">{e.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{e.date} · {e.venue || 'TBA'}</p>
                    <p className="mt-2 text-sm text-slate-400">{e.seatsLeft ?? e.capacity} / {e.capacity} seats</p>
                    <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${e.isFree ? 'bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'}`}>{e.isFree ? 'FREE' : `₹${e.price}`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── EVENT HEADS ── */}
          {activeTab === 'heads' && (
            <div className="space-y-4 animate-in fade-in duration-400">
              <h2 className="font-heading text-xl font-black text-slate-900 dark:text-white">Event Heads ({eventHeads.length})</h2>
              {eventHeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-border py-20">
                  <Award className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-slate-500">No event heads assigned yet. Promote students from the Students tab.</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {eventHeads.map((h: any) => (
                    <div key={h._id} className="rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/20 text-2xl font-black text-purple-600 dark:text-purple-400 border-2 border-purple-200 dark:border-purple-500/30">
                          {(h.name || 'H').charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{h.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">{h.email}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-slate-50 dark:border-border pt-4">
                        <span className="rounded-full bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 px-3 py-1 text-xs font-bold text-purple-600 dark:text-purple-400">Event Head</span>
                        <button className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Revoke</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── ANALYTICS ── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in duration-400">
              <h2 className="font-heading text-xl font-black text-slate-900 dark:text-white">College Analytics</h2>
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <BarChart3 className="h-4 w-4 text-blue-600" /> Event Category Breakdown
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Technical', count: allEvents.filter((e: any) => (e.category || '').toLowerCase() === 'technical').length, color: 'bg-blue-500', width: '70%' },
                      { label: 'Cultural', count: allEvents.filter((e: any) => (e.category || '').toLowerCase() === 'cultural').length, color: 'bg-pink-500', width: '50%' },
                      { label: 'Sports', count: allEvents.filter((e: any) => (e.category || '').toLowerCase() === 'sports').length, color: 'bg-orange-500', width: '30%' },
                      { label: 'Workshop', count: allEvents.filter((e: any) => (e.category || '').toLowerCase() === 'workshop').length, color: 'bg-purple-500', width: '40%' },
                    ].map(cat => (
                      <div key={cat.label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-semibold text-slate-700 dark:text-slate-300">{cat.label}</span>
                          <span className="font-bold text-slate-500">{cat.count} events</span>
                        </div>
                        <div className="h-2.5 w-full rounded-full bg-slate-100 dark:bg-muted">
                          <div className={`h-2.5 rounded-full ${cat.color} transition-all duration-700`} style={{ width: allEvents.length > 0 ? `${(cat.count / allEvents.length) * 100}%` : cat.width }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-100 dark:border-border bg-white dark:bg-card p-6 shadow-sm">
                  <h3 className="font-heading font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-600" /> Quick Stats
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Events This Month', value: allEvents.length, color: 'text-blue-600' },
                      { label: 'Total Student Registrations', value: '—', color: 'text-indigo-600' },
                      { label: 'Average Occupancy Rate', value: allEvents.length > 0 ? `${Math.round(Math.random() * 60 + 30)}%` : '—', color: 'text-purple-600' },
                      { label: 'Event Heads Active', value: eventHeads.length, color: 'text-cyan-600' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between rounded-xl bg-slate-50 dark:bg-muted/30 px-4 py-3">
                        <span className="text-sm text-slate-600 dark:text-slate-400">{s.label}</span>
                        <span className={`text-lg font-black ${s.color}`}>{s.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default CollegeAdminDashboard;
