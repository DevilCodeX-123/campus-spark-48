import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Navigate, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import {
  Shield, Building2, AlertTriangle, CheckCircle, XCircle, Activity, 
  Loader2, Megaphone, Plus, Trash2, PlayCircle, Image as ImageIcon,
  LayoutDashboard, Users, BarChart3, LogOut, Search, ChevronRight,
  TrendingUp, Globe, Settings, Bell, DollarSign, Filter
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip as RechartsTip, ResponsiveContainer, BarChart, Bar,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const NAV = [
  { id: 'analytics', label: 'Network Analytics', icon: LayoutDashboard },
  { id: 'requests',  label: 'College Requests',   icon: AlertTriangle },
  { id: 'colleges',  label: 'All Colleges',      icon: Building2 },
  { id: 'ads',       label: 'Ad Campaigns',      icon: Megaphone },
  { id: 'settings',  label: 'Platform Config',   icon: Settings },
];

const COLORS = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#6366f1'];

const OwnerPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [sideOpen, setSideOpen] = useState(true);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [newAd, setNewAd] = useState({ 
    title: '', description: '', mediaUrl: '', mediaType: 'image', 
    placement: 'homepage', target: 'all', startDate: '', endDate: '' 
  });
  
  const qc = useQueryClient();
  const { user, logout, isLoading: authLoading } = useAuth();

  // Queries (with enhanced error resilience)
  const { data: requests = [], isLoading: loadReq } = useQuery({
    queryKey: ['pendingRequests'],
    queryFn: () => api.get('/owner/requests', { headers: { 'x-owner-secret-key': 'ownerpass2024' } }).then(r => r.data).catch(() => []),
    enabled: !!user && (activeTab === 'requests' || activeTab === 'analytics'),
    staleTime: 30000
  });

  const { data: colleges = [], isLoading: loadColls } = useQuery({
    queryKey: ['allColleges'],
    queryFn: () => api.get('/auth/colleges').then(r => r.data).catch(() => []),
    enabled: !!user && (activeTab === 'colleges' || activeTab === 'analytics'),
    staleTime: 60000
  });

  const { data: ads = [], isLoading: loadAds } = useQuery({
    queryKey: ['allAds'],
    queryFn: () => api.get('/ads').then(r => r.data).catch(() => []),
    enabled: !!user && activeTab === 'ads'
  });

  // Mutations
  const approve = useMutation({
    mutationFn: (id: string) => api.post(`/owner/approve/${id}`, {}, { headers: { 'x-owner-secret-key': 'ownerpass2024' } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['pendingRequests'] }); toast.success('Approved!'); }
  });

  const createAd = useMutation({
    mutationFn: (data: any) => api.post('/ads', data, { headers: { 'x-owner-secret-key': 'ownerpass2024' } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['allAds'] }); setShowCreateAd(false); toast.success('Ad Live!'); }
  });

  // 🛡️ Loading Guard: Prevents flashing login screen while auth state is being restored
  if (authLoading) return <div className="flex h-screen items-center justify-center bg-[#080c14]"><Loader2 className="h-12 w-12 animate-spin text-red-600" /></div>;
  if (!user || user.role !== 'owner') return <Navigate to="/login" replace />;

  const statCards = [
    { label: 'Total Colleges', value: Array.isArray(colleges) ? colleges.length : 0, icon: Building2, color: 'red' },
    { label: 'Pending Requests', value: Array.isArray(requests) ? requests.length : 0, icon: AlertTriangle, color: 'blue' },
    { label: 'Total Events', value: 124, icon: Activity, color: 'green' },
    { label: 'Active Users', value: 8902, icon: Users, color: 'purple' },
  ];

  const chartData = [
    { month: 'Jan', revenue: 4500, users: 1200 },
    { month: 'Feb', revenue: 5200, users: 1800 },
    { month: 'Mar', revenue: 4800, users: 2400 },
    { month: 'Apr', revenue: 6100, users: 3100 },
    { month: 'May', revenue: 5900, users: 3800 },
    { month: 'Jun', revenue: 7200, users: 4500 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#080c14]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 flex flex-col bg-white dark:bg-[#0d121f] border-r border-slate-100 dark:border-white/5 shadow-xl transition-all duration-300 ${sideOpen ? 'w-64' : 'w-0 overflow-hidden'}`}>
        <div className="flex items-center gap-3 px-6 py-6 border-b border-slate-100 dark:border-white/5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-rose-700 shadow-lg text-white font-black text-xl">P</div>
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter">PLATFORM OWNER</p>
            <p className="text-[10px] font-bold text-red-600">Super Administrator</p>
          </div>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${active 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-red-600'}`}>
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button onClick={() => { logout(); navigate('/'); }} className="flex w-full items-center gap-3 rounded-xl border border-red-100 dark:border-red-900/30 px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all">
            <LogOut className="h-4 w-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sideOpen ? 'ml-64' : 'ml-0'}`}>
        <header className="sticky top-0 z-20 flex items-center justify-between px-8 py-4 bg-white/80 dark:bg-[#0d121f]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/5">
          <div className="flex items-center gap-4">
            <button onClick={() => setSideOpen(!sideOpen)} className="text-slate-400 hover:text-red-600 transition-colors">
              <Activity className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              {NAV.find(n => n.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-full bg-red-50 dark:bg-red-600/10 border border-red-100 dark:border-red-600/20 px-4 py-1.5 text-xs font-black text-red-600">
              <Globe className="h-3.5 w-3.5" /> GLOBAL MONITOR
            </div>
          </div>
        </header>

        <main className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* ANALYTICS TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-8">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {statCards.map((s, i) => (
                  <div key={i} className="rounded-2xl bg-white dark:bg-[#0d121f] border border-slate-100 dark:border-white/5 p-6 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="rounded-xl bg-slate-50 dark:bg-white/5 p-3 text-red-600"><s.icon className="h-5 w-5" /></div>
                      <span className="text-[10px] font-black py-1 px-2 rounded-full bg-green-100 text-green-700">+12.4%</span>
                    </div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">{s.value}</p>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-2xl bg-white dark:bg-[#0d121f] border border-slate-100 dark:border-white/5 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Revenue Growth (USD)</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                        <defs>
                          <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f020"/>
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                        <RechartsTip contentStyle={{borderRadius: 12, border: 'none', background: '#1e293b', color: '#fff'}} />
                        <Area type="monotone" dataKey="revenue" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-2xl bg-white dark:bg-[#0d121f] border border-slate-100 dark:border-white/5 p-8 shadow-sm">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">Requests by Region</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={[
                          { name: 'Technical', value: 400 },
                          { name: 'Medical', value: 300 },
                          { name: 'Arts', value: 300 },
                          { name: 'Business', value: 200 },
                        ]} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                          {COLORS.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <RechartsTip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* REQUESTS TAB */}
          {activeTab === 'requests' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">New Onboarding Requests</h2>
                <div className="flex gap-2">
                  <button className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-500">SORT BY DATE</button>
                  <button className="rounded-xl border border-slate-200 dark:border-white/10 px-4 py-2 text-xs font-bold text-slate-500">FILTER</button>
                </div>
              </div>

              {loadReq ? (
                <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-red-600" /></div>
              ) : requests.length === 0 ? (
                <div className="flex h-96 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 dark:border-white/5 bg-white dark:bg-[#0d121f]">
                  <CheckCircle className="h-16 w-16 text-slate-100 dark:text-white/5 mb-4" />
                  <p className="text-slate-400 font-bold">ALL CLEAR. NO PENDING REQUESTS.</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {requests.map((req: any) => (
                    <div key={req._id} className="group relative overflow-hidden rounded-3xl bg-white dark:bg-[#0d121f] border border-slate-100 dark:border-white/5 p-8 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-black text-slate-900 dark:text-white">{req.collegeName}</h3>
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                            <Globe className="h-3 w-3" /> {req.collegeCity}
                          </div>
                        </div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-600/10 text-red-600 font-black text-xl italic">
                          {req.collegeName.charAt(0)}
                        </div>
                      </div>
                      
                      <div className="mt-8 space-y-3">
                        <div className="flex justify-between text-xs py-2 border-b border-slate-50 dark:border-white/5">
                          <span className="font-bold text-slate-400">APPLICANT</span>
                          <span className="font-black text-slate-900 dark:text-white">{req.name}</span>
                        </div>
                        <div className="flex justify-between text-xs py-2 border-b border-slate-50 dark:border-white/5">
                          <span className="font-bold text-slate-400">EMAIL</span>
                          <span className="font-black text-blue-600">{req.email}</span>
                        </div>
                        <div className="flex justify-between text-xs py-2 border-b border-slate-50 dark:border-white/5">
                          <span className="font-bold text-slate-400">WEBSITE</span>
                          <a href={req.collegeWebsite} target="_blank" className="font-black text-red-600 hover:underline">{req.collegeWebsite}</a>
                        </div>
                      </div>

                      <div className="mt-8 flex gap-4">
                        <button onClick={() => approve.mutate(req._id)} disabled={approve.isPending} className="flex-1 rounded-2xl bg-red-600 py-4 text-xs font-black text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all flex items-center justify-center gap-2">
                          {approve.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />} VERIFY & APPROVE
                        </button>
                        <button className="w-16 h-14 flex items-center justify-center rounded-2xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-red-600 transition-colors">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* COLLEGES TAB */}
          {activeTab === 'colleges' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Active Institutions</h2>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input placeholder="SEARCH NETWORK..." className="rounded-2xl border border-slate-100 dark:border-white/10 bg-white dark:bg-[#0d121f] pl-10 pr-6 py-3 text-xs font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 w-80" />
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl bg-white dark:bg-[#0d121f] border border-slate-100 dark:border-white/5 shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-white/5 text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    <tr>
                      <th className="px-8 py-5">Institution</th>
                      <th className="px-8 py-5">Admin Contact</th>
                      <th className="px-8 py-5">Metrics</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-white/5">
                    {colleges.map((c: any) => (
                      <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-white/3 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="h-10 w-10 rounded-xl bg-red-100 dark:bg-red-900/40 text-red-600 flex items-center justify-center font-black">
                              {c.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-black text-slate-900 dark:text-white">{c.name}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{c.city}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="text-xs font-bold text-slate-800 dark:text-white">{c.email}</p>
                          <p className="text-[10px] text-slate-400 font-bold">{c.website}</p>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <p className="text-sm font-black text-slate-900 dark:text-white">12</p>
                              <p className="text-[10px] text-slate-400 font-bold">EVENTS</p>
                            </div>
                            <div className="text-center">
                              <p className="text-sm font-black text-slate-900 dark:text-white">1.2K</p>
                              <p className="text-[10px] text-slate-400 font-bold">USERS</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="inline-flex rounded-full bg-green-100 dark:bg-green-600/20 px-3 py-1 text-[10px] font-black text-green-700 dark:text-green-400 uppercase">HEALTHY</span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Shield className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADS TAB */}
          {activeTab === 'ads' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase">Campaign Control</h2>
                  <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Network-wide visibility & marketing</p>
                </div>
                <button onClick={() => setShowCreateAd(!showCreateAd)} className="rounded-2xl bg-red-600 px-6 py-3 text-xs font-black text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all flex items-center gap-2">
                  <Plus className="h-4 w-4" /> CREATE CAMPAIGN
                </button>
              </div>

              {showCreateAd && (
                <div className="rounded-3xl bg-red-600 text-white p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                  <h3 className="text-lg font-black uppercase mb-6 flex items-center gap-2"><Megaphone className="h-5 w-5" /> NEW CAMPAIGN DATA</h3>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-100">TITLE</label>
                      <input value={newAd.title} onChange={e => setNewAd({...newAd, title: e.target.value})} className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm focus:bg-white/20 outline-none" />
                    </div>
                    <div className="space-y-2 lg:col-span-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-100">TARGET LANDING URL</label>
                      <input value={newAd.mediaUrl} onChange={e => setNewAd({...newAd, mediaUrl: e.target.value})} className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm focus:bg-white/20 outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-100">PLACEMENT</label>
                      <select value={newAd.placement} onChange={e => setNewAd({...newAd, placement: e.target.value})} className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm focus:bg-white/20 outline-none appearance-none">
                        <option value="homepage">HOMEPAGE HERO</option>
                        <option value="event_list">FEED INJECTION</option>
                        <option value="sidebar">MINI SIDEBAR</option>
                      </select>
                    </div>
                    <div className="space-y-2 lg:col-span-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-red-100">DESCRIPTION (HOOK)</label>
                      <textarea rows={2} value={newAd.description} onChange={e => setNewAd({...newAd, description: e.target.value})} className="w-full rounded-2xl bg-white/10 border border-white/20 px-4 py-3 text-sm focus:bg-white/20 outline-none resize-none" />
                    </div>
                  </div>
                  <div className="mt-8 flex gap-4">
                    <button onClick={() => createAd.mutate(newAd)} disabled={createAd.isPending} className="rounded-2xl bg-white py-4 px-10 text-xs font-black text-red-600 hover:bg-slate-50 transition-all flex items-center gap-2 uppercase">
                      {createAd.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <TrendingUp className="h-4 w-4" />} DEPLOY LIVE
                    </button>
                    <button onClick={() => setShowCreateAd(false)} className="rounded-2xl border border-white/30 py-4 px-8 text-xs font-black text-white hover:bg-white/10 transition-all uppercase">CANCEL</button>
                  </div>
                </div>
              )}

              <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-6">
                  {loadAds ? <Loader2 className="h-8 w-8 animate-spin text-red-600 mx-auto" /> : ads.length === 0 ? (
                    <div className="rounded-3xl border-2 border-dashed border-slate-100 dark:border-white/5 py-12 text-center text-slate-400 font-bold">NO ACTIVE CAMPAIGNS</div>
                  ) : ads.map((ad: any) => (
                    <div key={ad._id} className="rounded-3xl bg-white dark:bg-[#0d121f] border border-slate-100 dark:border-white/5 p-6 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="h-20 w-32 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-300">
                          {ad.mediaType === 'video' ? <PlayCircle className="h-8 w-8" /> : <ImageIcon className="h-8 w-8" />}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white uppercase tracking-tighter">{ad.title}</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{ad.placement}</p>
                          <div className="mt-2 flex items-center gap-3">
                            <span className="text-[10px] font-black text-red-600">{(ad.views || 0).toLocaleString()} IMPRESSIONS</span>
                            <span className="text-[10px] font-black text-blue-600">{(ad.clicks || 0).toLocaleString()} CLICKS</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right mr-4">
                          <p className="text-sm font-black text-slate-900 dark:text-white">{( (ad.clicks || 0) / (ad.views || 1) * 100).toFixed(2)}%</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">AVG CTR</p>
                        </div>
                        <button className="p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="h-5 w-5" /></button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-3xl bg-white dark:bg-[#0d121f] border border-slate-100 dark:border-white/5 p-8 shadow-sm h-fit">
                    <h3 className="text-xs font-black uppercase text-slate-500 tracking-widest border-b border-slate-50 dark:border-white/5 pb-4 mb-6">SYSTEM RESOURCE STATUS</h3>
                    <div className="space-y-6">
                      {[
                        { label: 'API GATEWAY', val: '99.9%', color: 'text-green-500' },
                        { label: 'DB LATENCY', val: '14MS', color: 'text-blue-500' },
                        { label: 'STORAGE', val: '2.4TB', color: 'text-slate-900 dark:text-white' },
                        { label: 'HMR STATUS', val: 'READY', color: 'text-rose-500' },
                      ].map(r => (
                        <div key={r.label} className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-slate-400">{r.label}</span>
                          <span className={`text-sm font-black ${r.color}`}>{r.val}</span>
                        </div>
                      ))}
                    </div>
                </div>
              </div>
            </div>
          )}

          {/* ────── ADS MANAGEMENT ────── */}
          {activeTab === 'ads' && (
             <div className="space-y-10 animate-in fade-in duration-500">
                <div className="flex items-center justify-between">
                   <h3 className="text-xl font-black text-white uppercase tracking-tight italic">Propaganda Engine (Ads)</h3>
                   <div className="flex bg-slate-800/50 p-1 rounded-xl">
                      <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest bg-red-600 text-white rounded-lg">Active Ops</button>
                      <button className="px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Archive</button>
                   </div>
                </div>

                <div className="grid gap-10 lg:grid-cols-3">
                   {/* Create Ad Form */}
                   <div className="lg:col-span-2 rounded-[40px] bg-[#0a0a0a] border border-white/5 p-10 shadow-sm">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-10 flex items-center gap-3">
                         <Plus className="h-4 w-4" /> Construct New Ad Block
                      </h4>
                      <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); toast.success('Ad campaign initiated.'); }}>
                         <div className="grid gap-8 md:grid-cols-2">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Campaign Identity</label>
                               <input placeholder="ENTER CAMPAIGN TITLE..." className="w-full rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-red-600 transition-all" />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Placement Sector</label>
                               <select className="w-full rounded-2xl bg-white/5 border border-white/10 px-6 py-4 text-xs font-black uppercase tracking-widest text-white outline-none">
                                  <option>Homepage Hero</option><option>Event Sidebar</option><option>Global Footer</option>
                               </select>
                            </div>
                            <div className="sm:col-span-2 space-y-2">
                               <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Asset URL (Video/Image)</label>
                               <div className="relative">
                                  <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                                  <input placeholder="https://cdn.collegeconnect.com/..." className="w-full rounded-2xl bg-white/5 border border-white/10 pl-14 pr-6 py-4 text-xs font-black uppercase tracking-widest text-white outline-none focus:border-red-600 transition-all" />
                               </div>
                            </div>
                         </div>
                         <button className="w-full py-5 bg-red-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-red-600/20 hover:bg-red-500 transition-all flex items-center justify-center gap-3 active:scale-95">
                            <Send className="h-4 w-4" /> Execute Deployment
                         </button>
                      </form>
                   </div>

                   {/* Stats Sidebar */}
                   <div className="space-y-8">
                      <div className="rounded-[40px] bg-red-600 text-white p-10 shadow-2xl relative overflow-hidden group">
                         <div className="absolute top-0 right-0 h-40 w-40 bg-white/20 rounded-full blur-[80px] -translate-y-20 translate-x-10" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-8">CTR Analytics</h4>
                         <div className="space-y-6">
                            {[
                               { l: 'Total Reach', v: '2.4M' },
                               { l: 'Ad Views', v: '840K' },
                               { l: 'Engagement', v: '12.4%' },
                            ].map(s => (
                               <div key={s.l} className="flex justify-between items-center border-b border-white/20 pb-4 last:border-0 last:pb-0">
                                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">{s.l}</span>
                                  <span className="text-2xl font-black tabular-nums tracking-tighter">{s.v}</span>
                               </div>
                            ))}
                         </div>
                      </div>
                      <div className="rounded-[40px] bg-[#0a0a0a] border border-white/5 p-10">
                         <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] mb-8">Active Impressions</h4>
                         <div className="h-32 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                               <AreaChart data={[{ x: 0, y: 10 }, { x: 1, y: 20 }, { x: 2, y: 15 }, { x: 3, y: 40 }]}>
                                  <Area type="monotone" dataKey="y" stroke="#dc2626" fill="#dc262620" strokeWidth={3} />
                               </AreaChart>
                            </ResponsiveContainer>
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

export default OwnerPanel;
