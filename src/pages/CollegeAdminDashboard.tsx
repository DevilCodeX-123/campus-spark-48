import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import {
  LayoutDashboard, Building2, Users, Calendar, Award,
  DollarSign, BarChart3, LogOut, Menu, X, Search, Plus, 
  Pencil, Trash2, Loader2, Star, TrendingUp, Settings, 
  MapPin, Upload, UserPlus, Users2, Bell, ChevronRight, 
  Eye, CheckCircle, Clock, AlertCircle, MoreVertical, 
  Download, Filter, ArrowUpRight, ArrowDownRight, Share2,
  Lock, Globe, ShieldCheck, Mail, Link as LinkIcon
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import CampusMap from '@/components/CampusMap';

/* ─── Premium Navigation ─── */
const NAV_ITEMS = [
  { id: 'overview',  label: 'Control Center',   icon: LayoutDashboard, color: 'text-blue-500' },
  { id: 'profile',   label: 'College Profile',  icon: Building2,       color: 'text-indigo-500' },
  { id: 'students',  label: 'Student Registry', icon: Users,           color: 'text-teal-500' },
  { id: 'events',    label: 'Event Manager',    icon: Calendar,        color: 'text-orange-500' },
  { id: 'heads',     label: 'Event Heads',      icon: Award,           color: 'text-purple-500' },
  { id: 'budget',    label: 'Budget Suite',     icon: DollarSign,      color: 'text-emerald-500' },
  { id: 'analytics', label: 'Growth Insights',  icon: BarChart3,       color: 'text-rose-500' },
];

const COLORS = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#06b6d4'];

const CollegeAdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState('overview');
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', venue: '', category: 'Technical' });
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  /* ─── Data Fetching ─── */
  const { data: students = [], isLoading: loadingStu } = useQuery({
    queryKey: ['ca_students', user?.collegeId],
    queryFn: () => {
      if (!user?.collegeId) return [];
      return api.get(`/auth/users?collegeId=${user?.collegeId}&role=student`).then(r => r.data).catch(() => []);
    },
    enabled: !!user?.collegeId,
  });

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['ca_events', user?.collegeId],
    queryFn: () => {
      if (!user?.collegeId) return [];
      return api.get(`/events?collegeId=${user?.collegeId}`).then(r => r.data).catch(() => []);
    },
    enabled: !!user?.collegeId,
  });

  /* ─── Computed State ─── */
  const allStudents = Array.isArray(students) ? students : [];
  const allEvents = Array.isArray(events) ? events : [];
  const eventHeads = allStudents.filter((s: any) => s.role === 'event_head');
  const regularStudents = allStudents.filter((s: any) => s.role === 'student');
  
  const filteredStudents = regularStudents.filter((s: any) => 
    (s.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
    (s.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  /* ─── Mutations ─── */
  const promoteToHead = useMutation({
    mutationFn: (stuId: string) => api.put(`/auth/users/${stuId}/role`, { role: 'event_head' }),
    onSuccess: () => {
      toast.success('Successfully promoted to Event Head');
      qc.invalidateQueries({ queryKey: ['ca_students'] });
    },
    onError: () => toast.error('Promotion failed. Network error.')
  });

  const revokeHead = useMutation({
    mutationFn: (stuId: string) => api.put(`/auth/users/${stuId}/role`, { role: 'student' }),
    onSuccess: () => {
      toast.success('Event Head role revoked');
      qc.invalidateQueries({ queryKey: ['ca_students'] });
    }
  });

  /* ─── Mock Data for Charts ─── */
  const registrationTrend = [
    { name: 'Mon', count: 45 }, { name: 'Tue', count: 52 }, { name: 'Wed', count: 86 },
    { name: 'Thu', count: 120 }, { name: 'Fri', count: 95 }, { name: 'Sat', count: 210 }, { name: 'Sun', count: 180 },
  ];

  const budgetAllocation = [
    { name: 'Marketing', value: 400000 },
    { name: 'Technical', value: 300000 },
    { name: 'Logistics', value: 200000 },
    { name: 'Prizes', value: 100000 },
  ];

  return (
    <div className="flex min-h-screen bg-[#f8fafc] dark:bg-[#030711]">
      {/* ──── SIDEBAR ──── */}
      <aside className={`fixed inset-y-0 left-0 z-40 flex flex-col bg-white dark:bg-[#090b14] border-r border-[#e2e8f0] dark:border-white/5 shadow-2xl transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden opacity-0'}`}>
        <div className="p-8 border-b border-[#f1f5f9] dark:border-white/5">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
              {user?.college?.charAt(0) || 'C'}
            </div>
            <div className="min-w-0">
                <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none truncate">{user?.college || 'Institution'}</h1>
                <div className="flex items-center gap-1 mt-1 text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                  <ShieldCheck className="h-2.5 w-2.5" /> Institutional Admin
                </div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${active 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/25 translate-x-1' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-blue-600'}`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
                {active && <ChevronRight className="ml-auto h-3 w-3 opacity-70" />}
              </button>
            );
          })}
        </nav>

        <div className="p-6 border-t border-[#f1f5f9] dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02]">
           <div className="flex items-center gap-3 rounded-2xl bg-white dark:bg-[#111422] p-4 shadow-sm border border-slate-100 dark:border-white/5">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">
                {user?.name?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0 mr-2">
                 <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase">{user?.name}</p>
                 <button onClick={() => { logout(); navigate('/'); }} className="text-[10px] font-bold text-red-500 hover:text-red-600 uppercase tracking-widest mt-0.5">Logout</button>
              </div>
              <Settings className="h-4 w-4 text-slate-300 hover:text-slate-600 cursor-pointer" />
           </div>
        </div>
      </aside>

      {/* ──── MAIN CONTENT ──── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        {/* Top Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-10 py-5 bg-white/80 dark:bg-[#030711]/80 backdrop-blur-2xl border-b border-[#e2e8f0] dark:border-white/5 shadow-sm">
           <div className="flex items-center gap-5">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center justify-center h-10 w-10 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-500 hover:text-blue-600 transition-all hover:scale-105"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {NAV_ITEMS.find(n => n.id === activeTab)?.label}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">{user?.college}</p>
                    <span className="h-1 w-1 rounded-full bg-slate-300" />
                    <span className="text-[9px] font-black text-blue-500 uppercase flex items-center gap-1"><Lock className="h-2.5 w-2.5" /> Scoped Access</span>
                  </div>
              </div>
           </div>

           <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 px-4 py-1.5 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                 Server Live: 14ms
              </div>
              <button className="relative p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-blue-600 transition-all">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-[#030711]" />
              </button>
              <div className="h-8 w-[1px] bg-[#e2e8f0] dark:bg-white/5 mx-2" />
              <div className="flex items-center gap-3">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black leading-none uppercase text-slate-900 dark:text-white">ID: AD-9201</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 tracking-widest italic">{new Date().toDateString()}</p>
                 </div>
              </div>
           </div>
        </header>

        <main className="flex-1 p-10 space-y-10 animate-in fade-in slide-in-from-bottom-3 duration-500">

          {/* ────── OVERVIEW ────── */}
          {activeTab === 'overview' && (
            <div className="space-y-10">
               {/* Quick KPI Grid */}
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Total Enrolled', val: allStudents.length, icon: Users, trend: '+12.4%', up: true, grad: 'from-blue-600 to-blue-700' },
                    { label: 'Active Events',  val: allEvents.length, icon: Calendar, trend: '+2', up: true, grad: 'from-orange-500 to-orange-600' },
                    { label: 'Event Heads',    val: eventHeads.length, icon: Award, trend: 'Optimal', up: true, grad: 'from-purple-600 to-purple-700' },
                    { label: 'Total Growth',   val: '₹2.4M', icon: DollarSign, trend: '-4.2%', up: false, grad: 'from-emerald-600 to-emerald-700' },
                  ].map((stat, i) => (
                    <div key={i} className="group relative overflow-hidden rounded-3xl bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-8 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                       <div className={`absolute top-0 right-0 h-24 w-24 rounded-bl-[3rem] bg-gradient-to-br ${stat.grad} opacity-[0.03] group-hover:opacity-[0.07] transition-opacity`} />
                       <div className={`h-12 w-12 rounded-2xl bg-gradient-to-tr ${stat.grad} flex items-center justify-center text-white shadow-xl shadow-blue-500/10 mb-6 group-hover:scale-110 transition-transform`}>
                          <stat.icon className="h-5 w-5" />
                       </div>
                       <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                       <div className="flex items-end justify-between">
                          <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter">{stat.val}</p>
                          <span className={`${stat.up ? 'text-emerald-500' : 'text-rose-500'} text-[10px] font-black flex items-center gap-0.5 bg-slate-50 dark:bg-white/5 py-1 px-2 rounded-full`}>
                             {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                             {stat.trend}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Secondary Overview Row */}
               <div className="grid gap-8 lg:grid-cols-3">
                  {/* Left: Growth Chart */}
                  <div className="lg:col-span-2 rounded-[32px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-8 shadow-sm">
                     <div className="flex items-center justify-between mb-8">
                        <div>
                           <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Weekly Student Registration</h3>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time engagement activity</p>
                        </div>
                        <div className="flex gap-2">
                           <button className="rounded-xl px-3 py-1.5 text-[10px] font-black bg-slate-100 dark:bg-white/5 text-slate-500">7D</button>
                           <button className="rounded-xl px-3 py-1.5 text-[10px] font-black text-slate-400">30D</button>
                        </div>
                     </div>
                     <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <AreaChart data={registrationTrend}>
                              <defs>
                                 <linearGradient id="regGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
                                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                 </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f010" />
                              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                              <RechartsTip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', fontSize: '10px', color: '#fff' }} />
                              <Area type="monotone" dataKey="count" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#regGradient)" />
                           </AreaChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  {/* Right: Event Categories */}
                  <div className="rounded-[32px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-8 shadow-sm flex flex-col">
                     <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-8">Event Distribution</h3>
                     <div className="flex-1 flex flex-col justify-center">
                        <div className="h-56 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                 <Pie data={budgetAllocation} innerRadius={60} outerRadius={84} paddingAngle={8} dataKey="value">
                                    {budgetAllocation.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                 </Pie>
                                 <RechartsTip />
                              </PieChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 mt-6">
                           {budgetAllocation.map((item, i) => (
                             <div key={i} className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest truncate">{item.name}</span>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* ────── COLLEGE PROFILE ────── */}
          {activeTab === 'profile' && (
            <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
               <div className="rounded-[40px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 overflow-hidden shadow-sm">
                  {/* Hero / Cover */}
                  <div className="relative h-64 bg-slate-900 dark:bg-[#111422]">
                     <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600 via-transparent to-transparent" />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Globe className="h-32 w-32 text-white/5" />
                     </div>
                     <button className="absolute bottom-6 right-8 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl px-5 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-all">Change Cover</button>
                  </div>

                  {/* Profile Header */}
                  <div className="relative px-12 pb-12">
                     <div className="relative -mt-20 group">
                        <div className="h-40 w-40 rounded-[44px] bg-white dark:bg-[#090b14] p-1.5 shadow-2xl border-2 border-white/10">
                           <div className="h-full w-full rounded-[38px] bg-slate-100 dark:bg-white/5 overflow-hidden flex items-center justify-center bg-cover bg-center" 
                                style={{ backgroundImage: logoPreview ? `url(${logoPreview})` : 'none' }}>
                             {!logoPreview && <Building2 className="h-16 w-16 text-slate-300 dark:text-white/10" />}
                           </div>
                        </div>
                        <button 
                          onClick={() => logoInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 h-10 w-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 hover:scale-110 active:scale-95 transition-all group-hover:bg-blue-500"
                        >
                          <Upload className="h-4 w-4" />
                        </button>
                        <input ref={logoInputRef} type="file" className="hidden" accept="image/*" onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setLogoPreview(URL.createObjectURL(f));
                        }} />
                     </div>

                     <div className="mt-8 grid gap-12 lg:grid-cols-3">
                        <div className="lg:col-span-2 space-y-10">
                           <div className="space-y-6">
                              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                 <ShieldCheck className="h-4 w-4 text-emerald-500" /> Institution Identity
                              </h3>
                              <div className="grid gap-6 sm:grid-cols-2">
                                 <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">College Brand Name</label>
                                    <input defaultValue={user?.college} className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                                 </div>
                                 <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Official Website</label>
                                    <div className="relative">
                                       <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                       <input placeholder="https://www.college.edu" className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 pl-11 pr-5 py-3.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                                    </div>
                                 </div>
                                 <div className="sm:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Public Branding Bio</label>
                                    <textarea rows={4} className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-5 py-4 text-sm font-medium text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none resize-none" defaultValue="Premier technical research institution committed to academic excellence and futuristic innovation." />
                                 </div>
                              </div>
                           </div>

                           <div className="space-y-6">
                              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                                 <MapPin className="h-4 w-4 text-rose-500" /> Location Context
                              </h3>
                              <div className="grid gap-6 sm:grid-cols-2">
                                 <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Street View / Campus Address</label>
                                    <input defaultValue="Academic Block 4, Sector 12" className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                                 </div>
                                 <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Metropolitan City</label>
                                    <input defaultValue="Metropolis" className="w-full rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 px-5 py-3.5 text-sm font-bold text-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500/20 transition-all outline-none" />
                                 </div>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-10">
                           <div className="rounded-3xl bg-slate-50 dark:bg-white/[0.03] p-8 border border-slate-100 dark:border-white/5">
                              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Contact Authorization</h4>
                              <div className="space-y-6">
                                 <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Mail className="h-4 w-4" /></div>
                                    <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Support Email</p>
                                       <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{user?.email}</p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 bg-white dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400"><Lock className="h-4 w-4" /></div>
                                    <div>
                                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Admin ID</p>
                                       <p className="text-xs font-bold text-slate-700 dark:text-slate-300">#AD-INST-4920</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                           
                           <button onClick={() => toast.success('Institutional protocol updated successfully')} className="w-full py-5 rounded-[24px] bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-500 hover:-translate-y-1 transition-all flex items-center justify-center gap-3">
                              <CheckCircle className="h-4 w-4" /> Finalize Profile
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* ────── STUDENT REGISTRY ────── */}
          {activeTab === 'students' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex items-center justify-between flex-wrap gap-5">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Voter & Student Registry</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Found {regularStudents.length} Verified student entities</p>
                  </div>
                  <div className="flex items-center gap-4">
                      <div className="relative">
                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                         <input 
                           value={searchQuery} 
                           onChange={(e) => setSearchQuery(e.target.value)}
                           placeholder="FILTER ENTITIES..." 
                           className="pl-11 pr-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-[10px] uppercase font-black tracking-widest outline-none focus:ring-1 focus:ring-blue-600 w-64" 
                        />
                      </div>
                      <button className="p-3.5 rounded-2xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 hover:text-blue-600 transition-all"><Filter className="h-5 w-5" /></button>
                      <button 
                        onClick={() => toast.success('Exporting student registry to CSV...')}
                        className="flex items-center gap-3 px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 transition-all"
                      >
                         <Download className="h-4 w-4" /> Export CSV
                      </button>
                   </div>
               </div>

               <div className="rounded-[40px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 overflow-hidden shadow-sm">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50 dark:bg-white/[0.03] text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 dark:border-white/5">
                           <th className="px-10 py-6">Identity</th>
                           <th className="px-10 py-6">Protocol / Email</th>
                           <th className="px-10 py-6">Engagement</th>
                           <th className="px-10 py-6 text-right">Administrative Action</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                        {loadingStu ? (
                          <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" /></td></tr>
                        ) : filteredStudents.length === 0 ? (
                          <tr><td colSpan={4} className="py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">No matching entities recovered</td></tr>
                        ) : filteredStudents.slice(0, 50).map((stu, i) => (
                          <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-white/[0.02] transition-colors">
                             <td className="px-10 py-6">
                                <div className="flex items-center gap-5">
                                   <div className="h-12 w-12 rounded-[18px] bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-white/5 dark:to-white/10 flex items-center justify-center text-slate-900 dark:text-white font-black text-sm">
                                      {stu.name.charAt(0)}
                                   </div>
                                   <div>
                                      <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-blue-600 transition-colors">{stu.name}</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Verified Student</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-10 py-6 text-sm font-bold text-slate-500 dark:text-slate-400">{stu.email}</td>
                             <td className="px-10 py-6">
                                <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black bg-blue-50 dark:bg-blue-500/10 text-blue-600 uppercase">
                                   <div className="h-1.5 w-1.5 bg-blue-500 rounded-full" /> High Active
                                </span>
                             </td>
                             <td className="px-10 py-6 text-right">
                                <button 
                                  onClick={() => promoteToHead.mutate(stu._id)}
                                  disabled={promoteToHead.isPending}
                                  className="rounded-[14px] bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 px-4 py-2 text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95 disabled:opacity-50"
                                >
                                   {promoteToHead.isPending ? 'Processing...' : 'Promote to Head'}
                                </button>
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
                  <div className="px-10 py-5 bg-slate-50 dark:bg-white/[0.03] border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Showing PAGE 1 OF 12</p>
                     <div className="flex gap-2">
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-[#090b14] border border-slate-100 dark:border-white/10 text-slate-400"><ChevronRight className="h-4 w-4 rotate-180" /></button>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white"><ChevronRight className="h-4 w-4" /></button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* ────── EVENT MANAGER ────── */}
          {activeTab === 'events' && (
            <div className="space-y-8 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight font-heading">Event Portfolio Manager</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Construct and distribute institutional events</p>
                  </div>
                  <button 
                    onClick={() => setShowEventModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
                  >
                     <Plus className="h-4 w-4" /> Initialize Event
                  </button>
               </div>

               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {loadingEvents ? (
                    <div className="col-span-full h-80 flex items-center justify-center"><Loader2 className="h-10 w-10 animate-spin text-blue-600" /></div>
                  ) : allEvents.length === 0 ? (
                    <div className="col-span-full h-96 flex flex-col items-center justify-center rounded-[48px] border-2 border-dashed border-slate-100 dark:border-white/5">
                       <Calendar className="h-16 w-16 text-slate-200 dark:text-white/5 mb-4" />
                       <p className="text-slate-400 font-black uppercase tracking-widest">No Active Deployment</p>
                    </div>
                  ) : allEvents.map((e: any, i) => (
                    <div key={i} className="group relative rounded-[40px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-8 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                       <div className="absolute top-0 left-0 h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-600 opacity-80" />
                       <div className="flex items-start justify-between mb-8">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${e.status === 'ongoing' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600' : 'bg-blue-50 dark:bg-blue-500/10 text-blue-600'}`}>
                             {e.status || 'Active'}
                          </span>
                          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-blue-500"><Pencil className="h-3.5 w-3.5" /></button>
                             <button className="p-2 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                          </div>
                       </div>
                       
                       <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 line-clamp-1">{e.title}</h4>
                       <div className="space-y-2 mb-8">
                          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                             <Clock className="h-3.5 w-3.5 text-blue-500" /> {e.date}
                          </div>
                          <div className="flex items-center gap-3 text-xs font-bold text-slate-400 uppercase tracking-widest">
                             <MapPin className="h-3.5 w-3.5 text-blue-500" /> {e.venue || 'TBA'}
                          </div>
                       </div>

                       <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-white/5">
                          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                             Capacity: <span className="text-slate-900 dark:text-white">{e.capacity}</span>
                          </div>
                          <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-500">
                             Deep Data <ChevronRight className="h-3 w-3" />
                          </button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* ────── EVENT HEADS HUB ────── */}
          {activeTab === 'heads' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Event Heads</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Management tier commanders</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-500">SORT BY PERF.</button>
                  </div>
               </div>

               <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                  {eventHeads.length === 0 ? (
                    <div className="col-span-full h-80 flex flex-col items-center justify-center rounded-[48px] border-2 border-dashed border-slate-100 dark:border-white/5 bg-white/50 dark:bg-transparent">
                       <Award className="h-16 w-16 text-slate-200 dark:text-white/5 mb-4" />
                       <p className="text-slate-400 font-bold uppercase tracking-widest">No commanders assigned</p>
                       <button onClick={() => setActiveTab('students')} className="mt-4 text-xs font-black text-blue-600 hover:underline">ACCESS REGISTRY →</button>
                    </div>
                  ) : eventHeads.map((head, i) => (
                    <div key={i} className="group rounded-[36px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-8 shadow-sm hover:shadow-2xl transition-all">
                       <div className="flex flex-col items-center text-center">
                          <div className="relative mb-6">
                             <div className="h-24 w-24 rounded-[32px] bg-gradient-to-tr from-purple-500 to-purple-700 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-purple-500/20">
                                {head.name.charAt(0)}
                             </div>
                             <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-2xl bg-white dark:bg-[#090b14] p-1 shadow-lg border border-slate-100 dark:border-white/10 flex items-center justify-center">
                                <Award className="h-4 w-4 text-purple-600" />
                             </div>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-tight">{head.name}</h4>
                          <p className="text-[10px] font-medium text-slate-400 truncate w-full mt-1 mb-8">{head.email}</p>
                          
                          <div className="grid grid-cols-2 gap-4 w-full mb-8">
                             <div className="bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-3 border border-slate-50 dark:border-white/5">
                                <p className="text-lg font-black text-slate-900 dark:text-white tabular-nums">12</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Ops Managed</p>
                             </div>
                             <div className="bg-slate-50 dark:bg-white/[0.03] rounded-2xl p-3 border border-slate-50 dark:border-white/5">
                                <p className="text-lg font-black text-emerald-500 tabular-nums">4.9</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">PERFORMANCE</p>
                             </div>
                          </div>

                          <div className="flex gap-2 w-full">
                             <button className="flex-1 py-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-100 dark:border-white/5 text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-all">Report</button>
                             <button 
                                onClick={() => revokeHead.mutate(head._id)}
                                className="h-11 w-11 flex items-center justify-center bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-100 dark:border-rose-500/20 text-rose-500 hover:bg-rose-600 hover:text-white transition-all shadow-lg active:scale-95"
                             >
                                <Trash2 className="h-4 w-4" />
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* ────── BUDGET SUITE ────── */}
          {activeTab === 'budget' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Institutional Budget Flow</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit and allocation monitoring system</p>
                  </div>
                  <div className="flex gap-2">
                     <button className="h-11 px-6 rounded-2xl bg-emerald-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all flex items-center gap-2">
                        <Download className="h-4 w-4" /> Statement Export
                     </button>
                  </div>
               </div>

               <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-8">
                     <div className="rounded-[40px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-10 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-500/5 rounded-full blur-[80px]" />
                        <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Quarterly Revenue vs Expenditure</h4>
                        <div className="h-64 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={[
                                { q: 'Q1', rev: 400, exp: 280 },
                                { q: 'Q2', rev: 300, exp: 410 },
                                { q: 'Q3', rev: 550, exp: 320 },
                                { q: 'Q4', rev: 900, exp: 450 },
                              ]}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f010" />
                                 <XAxis dataKey="q" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700 }} />
                                 <YAxis hide />
                                 <RechartsTip cursor={{ fill: 'transparent' }} />
                                 <Bar dataKey="rev" fill="#10b981" radius={[6, 6, 0, 0]} barSize={28} />
                                 <Bar dataKey="exp" fill="#e2e8f010" radius={[6, 6, 0, 0]} barSize={28} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                        <div className="flex gap-8 mt-6">
                           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest"><div className="h-2 w-2 rounded-full bg-emerald-500" /> REVENUE FLOW</div>
                           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-40"><div className="h-2 w-2 rounded-full bg-slate-400" /> OPERACTIONAL EXPENSE</div>
                        </div>
                     </div>

                     <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-[32px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-8 shadow-sm">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Internal Auditor Status</p>
                           <div className="flex items-center justify-between">
                              <p className="text-xl font-black text-slate-900 dark:text-white uppercase">HEALTHY</p>
                              <div className="flex -space-x-3">
                                 {[1,2,3].map(i => <div key={i} className="h-9 w-9 rounded-full border-4 border-white dark:border-[#090b14] bg-slate-200" />)}
                              </div>
                           </div>
                           <div className="mt-8 h-1.5 w-full bg-slate-50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '74%' }} />
                           </div>
                        </div>
                        <div className="rounded-[32px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-8 shadow-sm">
                           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Net Reserve Position</p>
                           <p className="text-2xl font-black text-slate-900 dark:text-white">₹14.22M</p>
                           <p className="mt-2 text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1"><ArrowUpRight className="h-3 w-3" /> +₹2.1M Liquidity added</p>
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="rounded-[40px] bg-[#090b14] text-white p-10 shadow-2xl relative overflow-hidden">
                        <div className="absolute inset-0 bg-blue-600 opacity-20 blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                        <div className="relative z-10">
                           <h4 className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-8">Asset Allocation Hub</h4>
                           <div className="space-y-8">
                              {[
                                { l: 'Tech Resources', v: '₹4.2M' },
                                { l: 'Venue Rentals', v: '₹2.8M' },
                                { l: 'Marketing Fund', v: '₹1.5M' },
                                { l: 'Prizes & Grants', v: '₹1.1M' },
                              ].map((b, i) => (
                                <div key={i} className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                   <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">{b.l}</span>
                                   <span className="text-sm font-black tabular-nums tracking-tighter">{b.v}</span>
                                </div>
                              ))}
                           </div>
                           <button className="w-full mt-12 py-5 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-slate-100 transition-all active:scale-95">Rebalance Assets</button>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* ────── GROWTH ANALYTICS ────── */}
          {activeTab === 'analytics' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Network Growth Engine</h3>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Multi-vector scalability monitoring</p>
                  </div>
                  <button className="h-11 px-6 rounded-2xl bg-white dark:bg-[#090b14] border border-slate-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
                     <Calendar className="h-4 w-4" /> YEAR OVER YEAR
                  </button>
               </div>

               <div className="grid gap-8 lg:grid-cols-2">
                  <div className="rounded-[40px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-10 shadow-sm">
                     <h4 className="text-[10px] font-black tracking-widest uppercase text-slate-400 mb-8 border-l-4 border-blue-600 pl-4">Network Activity Vector</h4>
                     <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                           <LineChart data={[
                             { x: 0, y: 10 }, { x: 1, y: 30 }, { x: 2, y: 25 }, 
                             { x: 3, y: 45 }, { x: 4, y: 40 }, { x: 5, y: 70 },
                             { x: 6, y: 65 }, { x: 7, y: 95 },
                           ]}>
                              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f010" />
                              <XAxis hide />
                              <YAxis hide />
                              <RechartsTip />
                              <Line type="monotone" dataKey="y" stroke="#2563eb" strokeWidth={5} dot={false} strokeDasharray="10 5" animationDuration={2000} />
                           </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div className="rounded-[40px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-10 shadow-sm">
                        <div className="flex justify-between items-start mb-8">
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scaling Factor</p>
                           <TrendingUp className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div className="flex items-end gap-3 mb-6">
                           <p className="text-4xl font-black tracking-tighter tabular-nums text-slate-900 dark:text-white">x2.4</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase pb-1 tracking-widest">Growth Multiple</p>
                        </div>
                        <div className="h-2 w-full bg-slate-50 dark:bg-white/[0.03] rounded-full overflow-hidden">
                           <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full" style={{ width: '82%' }} />
                        </div>
                     </div>
                     <div className="grid gap-6 md:grid-cols-2">
                        <div className="rounded-[32px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-8 shadow-sm">
                           <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Churn Rate</h4>
                           <p className="text-xl font-black text-rose-500 tabular-nums">0.8%</p>
                        </div>
                        <div className="rounded-[32px] bg-white dark:bg-[#090b14] border border-[#e2e8f0] dark:border-white/5 p-8 shadow-sm">
                           <h4 className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Conversion</h4>
                           <p className="text-xl font-black text-emerald-500 tabular-nums">14.2%</p>
                        </div>
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
