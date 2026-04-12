import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import {
  LayoutDashboard, Users, ClipboardList, UserCheck, 
  MessageSquare, Settings, LogOut, Menu, X, Plus, 
  Search, Calendar, MapPin, Clock, ChevronRight,
  TrendingUp, Activity, CheckCircle, AlertCircle, 
  Loader2, Filter, MoreHorizontal, Send, Bell,
  UserPlus, Award, Zap, ShieldCheck, Trophy
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

const NAV = [
  { id: 'ops',      label: 'Ops Center',     icon: LayoutDashboard, color: 'text-violet-500' },
  { id: 'events',   label: 'My Events',      icon: Calendar,        color: 'text-indigo-500' },
  { id: 'winners',  label: 'Winners Wall',   icon: Award,           color: 'text-amber-500' },
  { id: 'budget',   label: 'Budget Suite',   icon: DollarSign,      color: 'text-emerald-500' },
  { id: 'team',     label: 'Team Hub',       icon: Users,           color: 'text-fuchsia-500' },
  { id: 'tasks',    label: 'Task Engine',    icon: ClipboardList,   color: 'text-pink-500' },
  { id: 'attendee', label: 'Attendee List',  icon: UserCheck,       color: 'text-sky-500' },
];

import { DollarSign } from 'lucide-react';

const COLORS = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e'];

const EventHeadDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ops');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [search, setSearch] = useState('');

  const qc = useQueryClient();

  // Queries
  const { data: events = [], isLoading: loadingEv } = useQuery({
    queryKey: ['head_events', user?.id],
    queryFn: () => {
      if (!user?.id) return [];
      return api.get(`/events?organizerId=${user?.id}`).then(r => r.data).catch(() => []);
    },
    enabled: !!user?.id
  });

  const { data: helpers = [], isLoading: loadingTeam } = useQuery({
    queryKey: ['head_team', user?.collegeId],
    queryFn: () => {
      if (!user?.collegeId) return [];
      return api.get(`/auth/users?collegeId=${user?.collegeId}&role=helper`).then(r => r.data).catch(() => []);
    },
    enabled: !!user?.collegeId
  });

  const mockTasks = [
    { id: 1, title: 'Check Sound Mix at Stage A', head: 'Arjun', status: 'Pending', priority: 'High', due: '14:30' },
    { id: 2, title: 'Collect VIP Lanyards', head: 'Sarah', status: 'Done', priority: 'Medium', due: '12:00' },
    { id: 3, title: 'Verify Fire Safety Entry', head: 'Mike', status: 'Blocked', priority: 'Critical', due: '10:00' },
  ];

  const engagementTrend = [
    { time: '09:00', count: 120 }, { time: '11:00', count: 450 },
    { time: '13:00', count: 780 }, { time: '15:00', count: 910 },
    { time: '17:00', count: 1100 }, { time: '19:00', count: 1250 },
  ];

  if (user?.role !== 'event_head') {
    // navigate('/'); // Prevent redirect loop during hydration
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa] dark:bg-[#050505]">
      {/* ──── SIDEBAR ──── */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#0a0a0a] border-r border-[#eeeeee] dark:border-white/5 shadow-2xl transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}>
        <div className="p-8 border-b border-[#f5f5f5] dark:border-white/5">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-[20px] bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-violet-500/20">H</div>
             <div className="min-w-0">
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Command Hub</p>
                <div className="flex items-center gap-1.5">
                   <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter truncate">EVENT HEAD</h1>
                   <div className="h-1.5 w-1.5 rounded-full bg-violet-500" />
                </div>
                <p className="text-[9px] font-bold text-violet-500 uppercase mt-1 tracking-widest leading-none truncate">{user?.college}</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-xs font-black uppercase tracking-widest transition-all duration-300 ${active ? 'bg-violet-600 text-white shadow-xl shadow-violet-600/20 translate-x-1' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-violet-600'}`}>
                <Icon className={`h-4 w-4 ${active ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6">
           <div className="rounded-3xl bg-slate-50 dark:bg-white/[0.03] p-5 border border-slate-100 dark:border-white/5">
              <div className="flex items-center gap-3 mb-4">
                 <div className="h-10 w-10 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-600 font-bold ">{user?.name?.charAt(0)}</div>
                 <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase truncate max-w-[120px]">{user?.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Team Lead</p>
                 </div>
              </div>
              <button onClick={() => { logout(); navigate('/'); }} className="w-full py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-rose-50 transition-all">Sign Out</button>
           </div>
        </div>
      </aside>

      {/* ──── MAIN CONTENT ──── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <header className="sticky top-0 z-30 flex items-center justify-between px-10 py-6 bg-white/80 dark:bg-[#050505]/80 backdrop-blur-2xl border-b border-[#eeeeee] dark:border-white/5">
          <div className="flex items-center gap-4">
             <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-500 hover:text-violet-600 transition-all">
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
             </button>
             <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{NAV.find(n => n.id === activeTab)?.label}</h2>
          </div>
          <div className="flex items-center gap-6">
             <div className="hidden lg:flex items-center gap-2 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-100 dark:border-violet-500/20 px-4 py-2 text-[10px] font-black text-violet-600 uppercase tracking-widest">
                <ShieldCheck className="h-3.5 w-3.5" /> SECURE CONTEXT
             </div>
             <button className="relative p-2 text-slate-400">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1.5 h-2 w-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#050505]" />
             </button>
          </div>
        </header>

        <main className="flex-1 p-10 space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-500">
          
          {/* OPS CENTER TAB */}
          {activeTab === 'ops' && (
            <div className="space-y-10">
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Events Active', val: events.length, icon: Calendar, color: 'text-violet-500' },
                    { label: 'Total Registrations', val: '4.2K', icon: TrendingUp, color: 'text-indigo-500' },
                    { label: 'Check-in Rate', val: '74%', icon: Activity, color: 'text-fuchsia-500' },
                    { label: 'Task Velocity', val: '86%', icon: Zap, color: 'text-sky-500' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 p-8 shadow-sm hover:shadow-xl transition-all group">
                       <div className={`h-12 w-12 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center ${s.color} mb-6 group-hover:scale-110 transition-transform`}>
                          <s.icon className="h-5 w-5" />
                       </div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                       <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter tabular-nums">{s.val}</p>
                    </div>
                  ))}
               </div>

               <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 rounded-[40px] bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 p-10 shadow-sm relative overflow-hidden">
                     <div className="absolute top-0 right-0 h-40 w-40 bg-violet-600/5 rounded-full blur-[100px]" />
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10">Real-time Check-in Flow</h3>
                     <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={engagementTrend}>
                              <defs>
                                 <linearGradient id="opGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeeee10" />
                              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                              <YAxis hide />
                              <RechartsTip />
                              <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#opGrad)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="rounded-[40px] bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 p-10 shadow-sm">
                     <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Priority Queue</h3>
                     <div className="space-y-6">
                        {mockTasks.map(t => (
                          <div key={t.id} className="flex items-center justify-between group">
                             <div className="flex items-center gap-4">
                                <div className={`h-2.5 w-2.5 rounded-full ${t.priority === 'Critical' ? 'bg-rose-500 animate-pulse' : t.priority === 'High' ? 'bg-amber-500' : 'bg-slate-300'}`} />
                                <div>
                                   <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tighter">{t.title}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Due {t.due} · {t.head}</p>
                                </div>
                             </div>
                             <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${t.status === 'Done' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                                {t.status}
                             </span>
                          </div>
                        ))}
                     </div>
                     <button className="w-full mt-10 py-5 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-violet-600/20 hover:bg-violet-500 transition-all">Launch Task Board →</button>
                  </div>
               </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === 'events' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Assigned Delegations</h3>
                  <button className="h-11 flex items-center gap-2 px-6 rounded-2xl bg-white dark:bg-white/5 border border-[#eeeeee] dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500"><Filter className="h-4 w-4" /> Filter Ops</button>
               </div>

               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {loadingEv ? (
                    <div className="col-span-full py-20 text-center"><Loader2 className="h-10 w-10 animate-spin text-violet-600 mx-auto" /></div>
                  ) : events.length === 0 ? (
                    <div className="col-span-full h-96 flex flex-col items-center justify-center rounded-[48px] border-2 border-dashed border-[#eeeeee] dark:border-white/5">
                        <Calendar className="h-16 w-16 text-slate-200 dark:text-white/5 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest">No Active Commands Assigned</p>
                    </div>
                  ) : events.map((e: any, i) => (
                    <div key={i} className="group overflow-hidden rounded-[40px] bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 p-10 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                       <div className="flex justify-between items-start mb-8">
                          <div className="h-14 w-14 rounded-2xl bg-violet-50 dark:bg-violet-500/10 flex items-center justify-center text-violet-600 font-black text-2xl group-hover:scale-110 transition-transform">
                             {e.title.charAt(0)}
                          </div>
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Active</span>
                       </div>
                       <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 line-clamp-1">{e.title}</h4>
                       <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">
                          <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {e.venue || 'Block B'}</span>
                          <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {e.date}</span>
                       </div>
                       
                       <div className="flex items-center justify-between pt-6 border-t border-[#f5f5f5] dark:border-white/5">
                          <div className="flex -space-x-3">
                             {[1,2,3].map(j => <div key={j} className="h-8 w-8 rounded-full border-4 border-white dark:border-[#0a0a0a] bg-slate-200" />)}
                          </div>
                          <button className="text-[10px] font-black uppercase tracking-widest text-violet-600 hover:underline">Manage Ops →</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* TEAM HUB TAB */}
          {activeTab === 'team' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">On-Ground Team (Helpers)</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Recovered {helpers.length} active volunteer entities</p>
                  </div>
                  <button className="h-11 flex items-center gap-3 px-8 rounded-2xl bg-violet-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-violet-600/30 hover:bg-violet-500 transition-all">
                     <UserPlus className="h-4 w-4" /> Onboard Delegate
                  </button>
               </div>

               <div className="rounded-[40px] bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50 dark:bg-white/[0.03] text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-[#eeeeee] dark:border-white/5">
                           <th className="px-10 py-6">Entity Identity</th>
                           <th className="px-10 py-6">Mission Status</th>
                           <th className="px-10 py-6">Assigned Load</th>
                           <th className="px-10 py-6 text-right">Interactions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-[#f5f5f5] dark:divide-white/5">
                        {loadingTeam ? (
                          <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-violet-600 mx-auto" /></td></tr>
                        ) : helpers.length === 0 ? (
                          <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase text-[10px] tracking-widest">No volunteer entities synchronized</td></tr>
                        ) : helpers.map((h, i) => (
                           <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.01] transition-all">
                              <td className="px-10 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-[18px] bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white font-black">{h.name.charAt(0)}</div>
                                    <div>
                                       <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{h.name}</p>
                                       <p className="text-[10px] font-bold text-slate-400">{h.email}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-10 py-6">
                                 <span className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                                    <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full" /> Online
                                 </span>
                              </td>
                              <td className="px-10 py-6 text-xs font-bold text-slate-500">4 Active Tasks</td>
                              <td className="px-10 py-6 text-right">
                                 <button className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-violet-600 transition-colors"><MessageSquare className="h-4 w-4" /></button>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {/* TASK ENGINE TAB */}
          {activeTab === 'tasks' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Deployment Task Queue</h3>
                  <button className="h-11 px-8 rounded-2xl bg-violet-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-violet-600/30 hover:bg-violet-500 transition-all flex items-center gap-2">
                     <Plus className="h-4 w-4" /> Construct Task
                  </button>
               </div>

               <div className="grid gap-8 lg:grid-cols-3">
                  {['Pending', 'Blocked', 'Done'].map(status => (
                    <div key={status} className="space-y-6">
                       <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center justify-between px-2">
                          {status} Queue <span className="h-5 w-5 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-900 dark:text-white">{mockTasks.filter(t => t.status === status).length}</span>
                       </h4>
                       <div className="space-y-4">
                          {mockTasks.filter(t => t.status === status).map(t => (
                            <div key={t.id} className="rounded-3xl bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 p-6 shadow-sm hover:shadow-xl transition-all cursor-move group">
                               <div className="flex justify-between items-start mb-4">
                                  <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${t.priority === 'Critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                                     {t.priority}
                                  </span>
                                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5"><MoreHorizontal className="h-4 w-4 text-slate-400" /></button>
                               </div>
                               <p className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-tight mb-4">{t.title}</p>
                               <div className="flex items-center justify-between pt-4 border-t border-[#f5f5f5] dark:border-white/5">
                                  <div className="flex items-center gap-2">
                                     <div className="h-6 w-6 rounded-lg bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black">{t.head.charAt(0)}</div>
                                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{t.head}</span>
                                  </div>
                                  <span className="text-[9px] font-black text-slate-400 uppercase">{t.due}</span>
                               </div>
                            </div>
                          ))}
                          <button className="w-full py-4 rounded-2xl border border-dashed border-[#eeeeee] dark:border-white/10 text-[9px] font-black text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all">DROP NEW ENTRY</button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* WINNERS TAB */}
          {activeTab === 'winners' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Final Victory Registry</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Assign trophies and reward points for completed ops</p>
                  </div>
               </div>

               <div className="grid gap-10 lg:grid-cols-3">
                  <div className="lg:col-span-2 rounded-[40px] bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 p-10 shadow-sm">
                     <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-10">Construct Trophy Entry</h4>
                     <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); toast.success('Winner assigned and points distributed.'); }}>
                        <div className="grid gap-8 sm:grid-cols-2">
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Event Mission</label>
                              <select className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none">
                                 {events.map((ev: any) => <option key={ev._id}>{ev.title}</option>)}
                              </select>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Winning Entity (Name/ID)</label>
                              <div className="relative">
                                 <UserPlus className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                 <input placeholder="SEARCH REGISTRY..." className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 pl-12 pr-5 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none" />
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Achievement Rank</label>
                              <div className="flex gap-2">
                                 {['1st', '2nd', '3rd'].map(r => (
                                    <button type="button" key={r} className="flex-1 py-4 rounded-xl border border-slate-100 dark:border-white/5 text-[10px] font-black uppercase text-slate-400 hover:bg-violet-600 hover:text-white transition-all">{r}</button>
                                 ))}
                              </div>
                           </div>
                           <div className="space-y-3">
                              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lp Reward Quantum</label>
                              <input type="number" defaultValue={500} className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-5 py-4 text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white outline-none" />
                           </div>
                        </div>
                        <button className="w-full py-5 bg-violet-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-violet-600/30 hover:bg-violet-500 transition-all flex items-center justify-center gap-3">
                           <Award className="h-4 w-4" /> Distribute Achievement
                        </button>
                     </form>
                  </div>

                  <div className="space-y-8">
                     <div className="rounded-[40px] bg-[#0a0a0a] text-white p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-amber-500/20 rounded-full blur-[80px]" />
                        <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] mb-8">Victory History</h4>
                        <div className="space-y-6">
                           {[1,2,3].map(i => (
                              <div key={i} className="flex items-center gap-5 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                 <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-amber-500"><Trophy className="h-5 w-5" /></div>
                                 <div>
                                    <p className="text-xs font-black uppercase">Entity #9201</p>
                                    <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest mt-1">Tech Summit · 1st Place</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* BUDGET TAB */}
          {activeTab === 'budget' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Fiscal Suite</h3>
                  <div className="flex gap-4">
                     <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl text-[10px] font-black text-emerald-600 uppercase">
                        Active Budget: ₹45,000
                     </div>
                  </div>
               </div>

               <div className="grid gap-8 lg:grid-cols-2">
                  <div className="rounded-[40px] bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 p-10 shadow-sm relative overflow-hidden">
                     <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-10">Quantum Allocation</h4>
                     <div className="h-72 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <BarChart data={[
                              { cat: 'Venue', allocated: 15000, spent: 12000 },
                              { cat: 'Food', allocated: 10000, spent: 11500 },
                              { cat: 'Prizes', allocated: 8000, spent: 5000 },
                              { cat: 'Misc', allocated: 12000, spent: 3000 },
                           ]}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eeeeee10" />
                              <XAxis dataKey="cat" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                              <YAxis hide />
                              <RechartsTip />
                              <Bar dataKey="allocated" fill="#e2e8f0" radius={[4, 4, 0, 0]} barSize={24} />
                              <Bar dataKey="spent" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={24} />
                           </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="rounded-[40px] bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 p-10 shadow-sm">
                     <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] mb-10">Log Expense Entry</h4>
                     <form className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Target Category</label>
                              <select className="w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-3 text-[10px] font-black uppercase text-slate-900 dark:text-white outline-none">
                                 <option>Venue</option><option>Food</option><option>Prizes</option>
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Entry Amount</label>
                              <input type="number" placeholder="₹0.00" className="w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-3 text-[10px] font-black uppercase text-slate-900 dark:text-white outline-none" />
                           </div>
                           <div className="sm:col-span-2 space-y-2">
                              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Description Protocol</label>
                              <input placeholder="TRANSACTION UTILITY..." className="w-full rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-4 py-3 text-[10px] font-black uppercase text-slate-900 dark:text-white outline-none" />
                           </div>
                        </div>
                        <button className="w-full py-4 bg-slate-950 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all">Execute Transfer</button>
                     </form>
                  </div>
               </div>
            </div>
          )}

          {/* ATTENDEE TAB */}
          {activeTab === 'attendee' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Presence Monitor</h3>
                  <div className="flex items-center gap-3">
                     <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input placeholder="FILTER LOGS..." className="h-11 rounded-2xl border border-[#eeeeee] dark:border-white/10 bg-white dark:bg-[#0a0a0a] pl-11 pr-5 py-3 text-[10px] font-black tracking-widest outline-none focus:ring-1 focus:ring-violet-500 w-64 uppercase" />
                     </div>
                  </div>
               </div>

               <div className="rounded-[40px] bg-white dark:bg-[#0a0a0a] border border-[#eeeeee] dark:border-white/5 p-10 shadow-sm">
                  <div className="grid gap-12 lg:grid-cols-3 mb-12">
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmed Presence</p>
                        <p className="text-4xl font-black text-slate-900 dark:text-white tabular-nums">1,208 <span className="text-sm font-bold text-emerald-500 ml-2 tracking-normal uppercase">Checked-in</span></p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Arrivals</p>
                        <p className="text-4xl font-black text-slate-300 tabular-nums">412</p>
                     </div>
                     <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gateway Velocity</p>
                        <p className="text-4xl font-black text-violet-600 tabular-nums">42 <span className="text-sm font-bold text-slate-400 ml-2 tracking-normal uppercase">p/min</span></p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     {[1,2,3,4,5].map(i => (
                        <div key={i} className="flex items-center justify-between py-4 border-b border-[#f5f5f5] dark:border-white/5 last:border-0">
                           <div className="flex items-center gap-4">
                              <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center"><CheckCircle className="h-3 w-3 text-emerald-600" /></div>
                              <div>
                                 <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight">Attendee Entity #CC-S-{9020 + i}</p>
                                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Gate Access #4 · 12 minutes ago</p>
                              </div>
                           </div>
                           <button className="text-[10px] font-black text-violet-600 uppercase tracking-widest hover:underline">View Pass</button>
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

export default EventHeadDashboard;
