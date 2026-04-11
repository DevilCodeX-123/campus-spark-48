import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import {
  LayoutDashboard, UserCheck, ClipboardList, MessageSquare, 
  MapPin, Calendar, Clock, LogOut, Menu, X, Scan, 
  Search, Bell, ChevronRight, CheckCircle2, Circle, 
  AlertCircle, ShieldCheck, Send, MoreVertical, Zap,
  Wifi, User, Activity, Loader2
} from 'lucide-react';
import QRScanner from '@/components/QRScanner';

const NAV = [
  { id: 'ground',   label: 'Ground Ops',    icon: LayoutDashboard, color: 'text-emerald-500' },
  { id: 'scanner',  label: 'Nexus Scanner', icon: Scan,            color: 'text-sky-500' },
  { id: 'queue',    label: 'Task Queue',    icon: ClipboardList,   color: 'text-amber-500' },
  { id: 'signal',   label: 'Signal Channel',icon: MessageSquare,   color: 'text-rose-500' },
];

const OrganizerHelperPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('ground');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isScanning, setIsScanning] = useState(false);

  // Queries
  const { data: events = [] } = useQuery({
    queryKey: ['helper_events'],
    queryFn: () => api.get('/events').then(r => r.data).catch(() => []),
  });

  const mockTasks = [
    { id: 101, title: 'Verify Gateway 4 Access Flow', priority: 'High', status: 'In-Progress', time: '14:20' },
    { id: 102, title: 'Resupply Water at Block C', priority: 'Medium', status: 'Pending', time: '15:00' },
    { id: 103, title: 'Emergency Audio Check Hall B', priority: 'Critical', status: 'Pending', time: 'Now' },
    { id: 104, title: 'Collect Unused Lanyards', priority: 'Low', status: 'Done', time: '11:00' },
  ];

  return (
    <div className="flex min-h-screen bg-[#fcfcfc] dark:bg-[#02040a]">
      {/* ──── SIDEBAR ──── */}
      <aside className={`fixed inset-y-0 left-0 z-40 bg-white dark:bg-[#0a0c14] border-r border-[#f0f0f0] dark:border-white/5 shadow-2xl transition-all duration-500 ease-in-out ${sidebarOpen ? 'w-72' : 'w-0 overflow-hidden'}`}>
        <div className="p-8 border-b border-[#f5f5f5] dark:border-white/5">
          <div className="flex items-center gap-4">
             <div className="h-12 w-12 rounded-[22px] bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20 italic">A</div>
             <div className="min-w-0">
                <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">On-Ground Faculty</p>
                <h1 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-tighter truncate leading-none">ASSISTANT</h1>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-1.5 truncate tracking-widest">{user?.college}</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {NAV.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${active ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20 translate-x-1' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-emerald-600'}`}>
                <Icon className={`h-4 w-4 ${active ? 'text-white' : item.color}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-6">
           <div className="rounded-[30px] bg-emerald-50/50 dark:bg-white/[0.02] p-6 border border-emerald-100 dark:border-white/5 space-y-6">
              <div className="flex items-center gap-3">
                 <div className="h-10 w-10 rounded-xl bg-white dark:bg-white/5 flex items-center justify-center text-emerald-600 font-black text-sm border border-emerald-100 dark:border-white/10">{user?.name?.charAt(0)}</div>
                 <div>
                    <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tight truncate max-w-[100px]">{user?.name}</p>
                    <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-widest">Shift Active</p>
                 </div>
              </div>
              <button onClick={() => { logout(); navigate('/'); }} className="w-full py-3.5 rounded-xl bg-white dark:bg-white/5 border border-emerald-100 dark:border-white/10 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-all">End Shift</button>
           </div>
        </div>
      </aside>

      {/* ──── MAIN CONTENT ──── */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-500 ${sidebarOpen ? 'ml-72' : 'ml-0'}`}>
        <header className="sticky top-0 z-30 flex items-center justify-between px-10 py-6 bg-white/70 dark:bg-[#02040a]/70 backdrop-blur-3xl border-b border-[#f0f0f0] dark:border-white/5">
           <div className="flex items-center gap-5">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-slate-400 hover:text-emerald-600 transition-all">
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h2 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">{NAV.find(n => n.id === activeTab)?.label}</h2>
           </div>

           <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-4 py-2 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                 <Wifi className="h-3.5 w-3.5" /> Signal: Strong
              </div>
              <button className="relative p-2 text-slate-300">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-2 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white dark:border-[#02040a]" />
              </button>
           </div>
        </header>

        <main className="flex-1 p-10 space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">

          {/* GROUND OPS TAB */}
          {activeTab === 'ground' && (
            <div className="space-y-10">
               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Assigned Missions', val: '04', icon: ClipboardList, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Successful Scans',  val: '182', icon: UserCheck, color: 'text-sky-500', bg: 'bg-sky-500/10' },
                    { label: 'Alert Responded',   val: '12', icon: Zap, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                    { label: 'Operational Time',  val: '4.2h', icon: Clock, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
                  ].map((s, i) => (
                    <div key={i} className="rounded-3xl bg-white dark:bg-[#0a0c14] border border-[#f0f0f0] dark:border-white/5 p-8 shadow-sm hover:shadow-xl transition-all">
                       <div className={`h-12 w-12 rounded-2xl ${s.bg} flex items-center justify-center ${s.color} mb-6`}>
                          <s.icon className="h-5 w-5" />
                       </div>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                       <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tighter leading-none">{s.val}</p>
                    </div>
                  ))}
               </div>

               <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-8">
                     <div className="rounded-[40px] bg-white dark:bg-[#0a0c14] border border-[#f0f0f0] dark:border-white/5 p-10 shadow-sm">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-10 flex items-center justify-between">
                           Active Deployments
                           <button className="text-[10px] text-emerald-600">RELOAD →</button>
                        </h3>
                        <div className="grid gap-8 md:grid-cols-2">
                           {events.slice(0, 2).map((e: any, i) => (
                             <div key={i} className="rounded-3xl bg-slate-50 dark:bg-white/[0.02] p-8 border border-[#eeeeee] dark:border-white/5 hover:border-emerald-500/20 transition-all group">
                                <div className="flex justify-between items-start mb-6">
                                   <div className="h-12 w-12 rounded-2xl bg-white dark:bg-white/5 flex items-center justify-center text-emerald-600 font-black text-xl">{e.title.charAt(0)}</div>
                                   <span className="text-[10px] font-black uppercase text-emerald-500">Live</span>
                                </div>
                                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">{e.title}</h4>
                                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                   <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {e.venue || 'Block G'}</span>
                                   <span className="flex items-center gap-1.5"><UserCheck className="h-3.5 w-3.5" /> {94 + i*14} In</span>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="rounded-[40px] bg-[#0a0c14] text-white p-10 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 h-40 w-40 bg-emerald-600/30 rounded-full blur-[80px] -translate-y-20 translate-x-10" />
                     <div className="relative z-10">
                        <h3 className="text-xs font-black text-emerald-400 uppercase tracking-[0.2em] mb-8 flex items-center gap-2">
                           <ShieldCheck className="h-4 w-4" /> Operational Command
                        </h3>
                        <div className="flex items-center gap-4 p-5 rounded-3xl bg-white/5 border border-white/10 mb-10">
                           <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center font-black">P</div>
                           <div>
                              <p className="text-xs font-black uppercase tracking-tight">Priya Sharma</p>
                              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Team Lead · Online</p>
                           </div>
                        </div>
                        <div className="space-y-4">
                           <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest">LAST SIGNAL:</p>
                           <p className="text-sm font-medium leading-relaxed italic opacity-80 border-l-2 border-emerald-500 pl-4">"Harshit, move to North Gate. Crowd surge detected. Ensure rapid check-ins."</p>
                        </div>
                        <button onClick={() => setActiveTab('signal')} className="w-full mt-12 py-5 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 transition-all flex items-center justify-center gap-3">
                           <MessageSquare className="h-4 w-4" /> Acknowledge & Respond
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {/* NEXUS SCANNER TAB */}
          {activeTab === 'scanner' && (
            <div className="max-w-4xl mx-auto space-y-12 animate-in zoom-in-95 duration-500">
               <QRScanner />
            </div>
          )}

          {/* TASK QUEUE TAB */}
          {activeTab === 'queue' && (
            <div className="space-y-10 animate-in fade-in duration-500">
               <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight">Active Operation Queue</h3>
                  <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Filter:</span>
                     <button className="px-5 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-[#eeeeee] dark:border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-500">IN-PROGRESS (1)</button>
                  </div>
               </div>

               <div className="space-y-6">
                  {mockTasks.map(t => (
                    <div key={t.id} className="group flex items-center justify-between p-8 bg-white dark:bg-[#0a0c14] border border-[#f0f0f0] dark:border-white/5 rounded-[36px] shadow-sm hover:translate-x-1 hover:shadow-xl transition-all cursor-pointer">
                       <div className="flex items-center gap-8">
                          <div className={`h-14 w-14 rounded-[22px] flex items-center justify-center ${t.status === 'Done' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500' : t.status === 'In-Progress' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 'bg-slate-50 dark:bg-white/5 text-slate-400 shadow-inner'}`}>
                             {t.status === 'Done' ? <CheckCircle2 className="h-7 w-7" /> : <Circle className="h-7 w-7" />}
                          </div>
                          <div>
                             <p className={`text-lg font-black uppercase tracking-tight ${t.status === 'Done' ? 'text-slate-300 line-through italic' : 'text-slate-900 dark:text-white'}`}>{t.title}</p>
                             <div className="flex items-center gap-5 mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> Due: {t.time}</span>
                                <span className={`flex items-center gap-1.5 ${t.priority === 'Critical' ? 'text-rose-500 font-black' : 'text-slate-400'}`}>
                                   <AlertCircle className="h-3.5 w-3.5" /> {t.priority} Priority
                                </span>
                             </div>
                          </div>
                       </div>
                       <button className="h-12 w-12 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 flex items-center justify-center text-slate-300 group-hover:text-emerald-500 transition-colors">
                          <ChevronRight className="h-6 w-6" />
                       </button>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* SIGNAL CHANNEL TAB */}
          {activeTab === 'signal' && (
            <div className="h-[calc(100vh-14rem)] flex bg-white dark:bg-[#0a0c14] border border-[#f0f0f0] dark:border-white/5 rounded-[48px] overflow-hidden shadow-2xl animate-in fade-in duration-500">
               <div className="w-[320px] border-r border-[#f5f5f5] dark:border-white/5 bg-slate-50/30 dark:bg-[#0a0c14]">
                  <div className="p-8 border-b border-[#f5f5f5] dark:border-white/5">
                     <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Deployment Signal</p>
                  </div>
                  <div className="p-4 space-y-2">
                     <button className="flex w-full items-center gap-4 p-5 rounded-[28px] bg-emerald-600 text-white shadow-xl shadow-emerald-500/20">
                        <div className="h-11 w-11 rounded-2xl bg-white/20 flex items-center justify-center text-white text-xs font-black italic">EH</div>
                        <div className="text-left font-black tracking-tight underline-offset-4 overflow-hidden">
                           <p className="text-xs uppercase truncate">Hub: Command Desk</p>
                           <p className="text-[9px] opacity-70 uppercase truncate">Active Link: Priya S.</p>
                        </div>
                     </button>
                  </div>
               </div>
               <div className="flex-1 flex flex-col bg-white dark:bg-[#0a0c14]">
                  <div className="p-8 border-b border-[#f5f5f5] dark:border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-violet-600 flex items-center justify-center text-white font-black">PS</div>
                        <div>
                           <p className="text-xs font-black uppercase tracking-tight">Priya Sharma</p>
                           <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Lead Coordinator</p>
                        </div>
                     </div>
                     <button className="p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 text-slate-300"><MoreHorizontal className="h-5 w-5" /></button>
                  </div>
                  <div className="flex-1 p-10 space-y-6 overflow-y-auto no-scrollbar">
                     <div className="flex flex-col gap-3 max-w-[70%]">
                        <div className="bg-slate-50 dark:bg-white/[0.03] p-6 rounded-[32px] rounded-tl-none border border-[#eeeeee] dark:border-white/5 shadow-sm">
                           <p className="text-sm font-medium text-slate-700 dark:text-slate-300 leading-relaxed">Agent 9, status on the scanning volume at Gate 4? We are seeing a buildup in the dashboard.</p>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 ml-2 uppercase tracking-widest">Priya · Sent 4m ago</span>
                     </div>
                  </div>
                  <div className="p-8 bg-white dark:bg-[#0a0c14] border-t border-[#f5f5f5] dark:border-white/5">
                     <div className="relative group">
                        <input placeholder="TRANSMIT FIELD LOG..." className="w-full rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-[#eeeeee] dark:border-white/5 px-8 py-5 text-[11px] font-black text-slate-800 dark:text-white uppercase tracking-widest outline-none focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-400" />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl hover:bg-emerald-500 transition-all active:scale-95 group-hover:shadow-emerald-500/30">
                           <Send className="h-5 w-5 ml-0.5" />
                        </button>
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

export default OrganizerHelperPanel;
