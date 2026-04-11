import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import {
  LayoutDashboard, Compass, Ticket, BookOpen, Star, 
  Search, Bell, Filter, Grid, List, MapPin, Calendar, 
  ChevronRight, ArrowRight, Heart, Award, Bookmark, 
  User, LogOut, Loader2, Sparkles, TrendingUp, Clock,
  ArrowUpRight, ShieldCheck, Zap, Map as MapIcon
} from 'lucide-react';
import EventCalendar from '@/components/EventCalendar';
import GamificationPanel from '@/components/GamificationPanel';
import CampusMap from '@/components/CampusMap';

const StudentPortal: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('discover');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Queries
  const { data: events = [], isLoading: loadEv } = useQuery({
    queryKey: ['student_events'],
    queryFn: () => api.get('/events').then(r => r.data).catch(() => []),
  });

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshops', 'Academic'];

  const filteredEvents = events.filter((e: any) => {
    const titleMatch = (e.title || '').toLowerCase().includes(search.toLowerCase());
    const catMatch = category.toLowerCase() === 'all' || 
                    (e.category || '').toLowerCase() === category.toLowerCase();
    return titleMatch && catMatch;
  });

  const mockPasses = [
    { title: 'Nexus Hackathon 2026', id: 'TKT-920182', date: 'Apr 20, 2026', status: 'upcoming', college: 'Main Campus' },
    { title: 'Symphony CultNite', id: 'TKT-112039', date: 'May 05, 2026', status: 'upcoming', college: 'City College' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#06080f] text-slate-900 dark:text-slate-100">
      {/* Dynamic Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 dark:bg-[#0d101a]/70 backdrop-blur-xl border-b border-slate-100 dark:border-white/5 py-3 px-8 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
           <div className="flex items-center gap-10">
              <Link to="/student" className="flex items-center gap-2">
                 <div className="h-9 w-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-blue-600/20">C</div>
                 <span className="font-black text-xl tracking-tighter uppercase">CampusConnect</span>
              </Link>
              <div className="hidden md:flex items-center gap-6">
                 {['discover', 'schedule', 'passes', 'achievements', 'campus', 'profile'].map(t => (
                    <button key={t} onClick={() => setTab(t)} className={`text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                       {t}
                    </button>
                 ))}
              </div>
           </div>
           
           <div className="flex items-center gap-5">
              <div className="relative hidden lg:block">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                 <input 
                   value={search} 
                   onChange={e => setSearch(e.target.value)} 
                   placeholder="SEARCH EVENTS, COLLEGES..." 
                   className="rounded-2xl border border-slate-100 dark:border-white/10 bg-slate-100/50 dark:bg-white/5 pl-11 pr-6 py-2.5 text-[10px] font-black tracking-widest outline-none focus:ring-1 focus:ring-blue-500 w-80 uppercase" 
                 />
              </div>
              <button className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors">
                 <Bell className="h-4 w-4" />
                 <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full border-2 border-white dark:border-[#0d101a]" />
              </button>
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-white/10">
                 <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-black leading-none uppercase">{user?.name}</p>
                    <p className="text-[9px] font-bold text-blue-500 uppercase mt-0.5 tracking-widest">Level 12 Student</p>
                 </div>
                 <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg">
                    {user?.name?.charAt(0)}
                 </div>
                 <button onClick={() => { logout(); navigate('/'); }} className="p-2 text-slate-400 hover:text-red-500"><LogOut className="h-4 w-4" /></button>
              </div>
           </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-10 space-y-12">
         
         {/* DISCOVER TAB */}
         {tab === 'discover' && (
           <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* HERO SECTION */}
              <section className="relative h-[480px] rounded-[48px] overflow-hidden group">
                 <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent z-10" />
                 <img src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80" alt="hero" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[10s]" />
                 
                 <div className="absolute inset-0 z-20 flex flex-col justify-center px-16 max-w-2xl space-y-6">
                    <div className="flex items-center gap-2 bg-blue-600/20 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 w-fit">
                       <Zap className="h-4 w-4 text-blue-500 fill-current" />
                       <span className="text-[10px] font-black text-blue-100 tracking-[0.2em] uppercase">Trending Now @ IIT Delhi</span>
                    </div>
                    <h1 className="text-6xl font-black text-white leading-tight tracking-tighter uppercase italic">The Future of <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Engineering.</span></h1>
                    <p className="text-slate-300 font-bold text-lg leading-relaxed">Join 500+ hackers at Nexus Hackathon 2026. Submissions open for next 48 hours.</p>
                    <div className="flex gap-4 pt-4">
                       <button 
                          onClick={() => {
                             const el = document.getElementById('discover-events');
                             if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="bg-white text-slate-900 rounded-2xl px-10 py-5 font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all shadow-2xl"
                       >
                          Register Now
                       </button>
                       <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-2xl px-8 py-5 font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all">View Details</button>
                    </div>
                 </div>
              </section>

              {/* FILTER BAR */}
              <section id="discover-events" className="flex items-center justify-between border-b border-slate-100 dark:border-white/5 pb-6">
                 <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
                    {categories.map(c => (
                      <button 
                         key={c} 
                         onClick={() => setCategory(c)} 
                         className={`whitespace-nowrap min-h-[44px] rounded-2xl px-8 text-[10px] font-black uppercase tracking-widest transition-all ${category.toLowerCase() === c.toLowerCase() ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30' : 'bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-500 hover:bg-slate-50'}`}
                      >
                         {c}
                      </button>
                    ))}
                 </div>
                 <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900"><Filter className="h-4 w-4" /> Filter</button>
                    <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl">
                       <button className="p-2 rounded-lg bg-white dark:bg-white/10 shadow-sm"><Grid className="h-4 w-4" /></button>
                       <button className="p-2 rounded-lg text-slate-400"><List className="h-4 w-4" /></button>
                    </div>
                 </div>
              </section>

              {/* EVENT GRID */}
              <section className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                 {loadEv ? (
                   <div className="col-span-full h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
                 ) : filteredEvents.length === 0 ? (
                   <div className="col-span-full h-80 flex flex-col items-center justify-center rounded-[48px] border-2 border-dashed border-slate-100 dark:border-white/5">
                      <Compass className="h-16 w-16 text-slate-200 dark:text-white/5 mb-4" />
                      <p className="text-slate-400 font-black uppercase tracking-widest">No matching events found</p>
                   </div>
                 ) : filteredEvents.map((e: any, i: number) => (
                   <div key={e._id} className="group relative rounded-[40px] bg-white dark:bg-[#0d101a] border border-slate-100 dark:border-white/5 p-5 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                      <div className="relative h-60 rounded-[32px] overflow-hidden mb-6">
                         <img src={`https://picsum.photos/seed/${i + 20}/800/600`} alt="ev" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl px-3 py-1.5 text-[10px] font-black text-white uppercase tracking-widest">
                            {e.category}
                         </div>
                         <button className="absolute top-4 right-4 h-10 w-10 bg-white/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-white hover:bg-red-500 hover:border-red-500 transition-all">
                            <Heart className="h-4 w-4" />
                         </button>
                      </div>
                      <div className="px-3">
                         <div className="flex items-center gap-2 mb-3">
                            <Calendar className="h-3.5 w-3.5 text-blue-500" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{e.date}</span>
                            <span className="h-1 w-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{e.venue || 'TBA'}</span>
                         </div>
                         <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter group-hover:text-blue-600 transition-colors mb-4">{e.title}</h3>
                         <div className="flex items-center justify-between pt-5 border-t border-slate-50 dark:border-white/5">
                            <div className="flex -space-x-3">
                               {[1,2,3].map(j => <div key={j} className="h-8 w-8 rounded-full border-4 border-white dark:border-[#0d101a] bg-slate-200" />)}
                               <div className="h-8 w-8 rounded-full border-4 border-white dark:border-[#0d101a] bg-blue-100 text-blue-600 flex items-center justify-center text-[8px] font-black">+42</div>
                            </div>
                            <span className="text-xl font-black text-slate-900 dark:text-white">{e.isFree ? 'FREE' : `₹${e.price}`}</span>
                         </div>
                      </div>
                   </div>
                 ))}
              </section>
           </div>
         )}

          {/* SCHEDULE TAB */}
          {tab === 'schedule' && (
            <div className="animate-in fade-in duration-500">
               <EventCalendar />
            </div>
          )}

          {/* PASSES TAB */}
          {tab === 'passes' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-300">
               <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-black uppercase tracking-tighter italic">Valid Field Passes</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{mockPasses.length} TICKETS recovered</p>
               </div>

               <div className="space-y-8">
                  {mockPasses.map((p, i) => (
                    <div key={i} className="relative flex flex-col md:flex-row bg-white dark:bg-[#0d101a] border border-slate-100 dark:border-white/5 rounded-[48px] overflow-hidden shadow-sm group hover:shadow-2xl transition-all">
                       <div className="w-full md:w-[320px] p-0 flex items-center justify-center border-r border-dashed border-slate-100 dark:border-white/10 relative overflow-hidden">
                          <img 
                            src={`https://images.unsplash.com/photo-${i === 0 ? '1504384308090-c894fdcc538d' : '1514525253344-f81fbf0ba76b'}?auto=format&fit=crop&q=80&w=800`} 
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80"
                            alt="event"
                          />
                          <div className="absolute inset-0 bg-blue-900/40 mix-blend-multiply" />
                          <div className="relative z-10 flex flex-col items-center">
                             <div className="h-32 w-32 bg-white/10 backdrop-blur-md rounded-[32px] p-6 shadow-2xl border border-white/20 flex items-center justify-center">
                                <div className="h-full w-full bg-white rounded-lg flex items-center justify-center p-2">
                                   <div className="h-full w-full bg-slate-900 rounded-[2px]" /> {/* QR Mock */}
                                </div>
                             </div>
                             <p className="mt-6 text-[10px] font-black text-white uppercase tracking-[0.2em]">{p.id}</p>
                          </div>
                          <div className="absolute top-1/2 -right-4 h-8 w-8 bg-slate-50 dark:bg-[#06080f] rounded-full -translate-y-1/2" />
                       </div>
                       <div className="flex-1 p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-2 mb-4">
                             <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                             <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Registry</span>
                          </div>
                          <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4 leading-none">{p.title}</h3>
                          <div className="flex items-center gap-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-10">
                             <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-blue-500" /> {p.college}</span>
                             <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-blue-500" /> {p.date}</span>
                          </div>
                          <div className="flex gap-4">
                             <button 
                                onClick={() => toast.success('Ticket PDF synchronized and downloaded.')}
                                className="h-14 px-10 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-blue-600/30 hover:bg-blue-500 transition-all flex items-center gap-3 active:scale-95"
                             >
                                <Ticket className="h-4 w-4" /> Download Pass
                             </button>
                             <button 
                                onClick={() => setTab('campus')}
                                className="h-14 px-8 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-white transition-all active:scale-95"
                             >
                                View On Map
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {/* ACHIEVEMENTS TAB */}
          {tab === 'achievements' && (
            <div className="animate-in fade-in duration-500">
               <GamificationPanel />
            </div>
          )}

          {/* CAMPUS TAB */}
          {tab === 'campus' && (
            <div className="animate-in fade-in duration-500 space-y-10">
               <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black uppercase tracking-tighter italic">Institutional Layout</h3>
                  <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest border border-emerald-100 dark:border-emerald-500/20">
                     <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" /> Signal Active: Gate 4
                  </div>
               </div>
               <CampusMap collegeId={user?.collegeId} />
            </div>
          )}

         {/* PROFILE TAB */}
         {tab === 'profile' && (
            <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-300">
               <div className="flex items-end gap-10">
                  <div className="h-40 w-40 rounded-[48px] bg-gradient-to-br from-blue-500 to-indigo-600 p-1 shadow-2xl">
                     <div className="h-full w-full rounded-[44px] border-8 border-white dark:border-[#06080f] overflow-hidden flex items-center justify-center bg-slate-100">
                        <User className="h-16 w-16 text-slate-300" />
                     </div>
                  </div>
                  <div className="pb-4 space-y-3">
                     <p className="text-xs font-black text-blue-500 uppercase tracking-[0.3em]">ID: CC-S-2026-9182</p>
                     <h2 className="text-5xl font-black uppercase tracking-tighter">{user?.name}</h2>
                     <div className="flex items-center gap-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                        <span>{user?.college}</span>
                        <span className="h-1 w-1 rounded-full bg-slate-300" />
                        <span>B.Tech CSE '26</span>
                     </div>
                  </div>
               </div>

               <div className="grid gap-8 lg:grid-cols-3">
                  <div className="lg:col-span-2 space-y-10">
                     <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Skill Achievements</h3>
                        <div className="grid gap-4 md:grid-cols-2">
                           {[
                             { skill: 'Hackathon Mastery', level: 'Expert', color: 'text-orange-500' },
                             { skill: 'Event Organization', level: 'Intermediate', color: 'text-blue-500' },
                             { skill: 'Strategic Planning', level: 'Advanced', color: 'text-purple-500' },
                             { skill: 'Global Citizen', level: 'Elite', color: 'text-emerald-500' },
                           ].map((s, i) => (
                             <div key={i} className="flex items-center gap-4 p-6 bg-white dark:bg-[#0d101a] border border-slate-100 dark:border-white/5 rounded-[32px]">
                                <Bookmark className={`h-8 w-8 ${s.color} fill-current`} />
                                <div>
                                   <p className="text-xs font-black uppercase tracking-tight">{s.skill}</p>
                                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.level} Level</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Accomplishment History</h3>
                           <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest">View Portfolio</button>
                        </div>
                        <div className="bg-white dark:bg-[#0d101a] border border-slate-100 dark:border-white/5 rounded-[40px] divide-y divide-slate-50 dark:divide-white/5">
                           {[1,2,3].map(i => (
                             <div key={i} className="p-8 flex items-center justify-between group">
                                <div className="flex items-center gap-6">
                                   <div className="h-12 w-12 bg-slate-50 dark:bg-white/5 rounded-2xl flex items-center justify-center text-slate-400"><Award className="h-6 w-6" /></div>
                                   <div>
                                      <p className="text-sm font-black uppercase tracking-tight">Technical Excellence Award</p>
                                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Granted by IIT Kharagpur · Mar 2026</p>
                                   </div>
                                </div>
                                <ArrowUpRight className="h-5 w-5 text-slate-200 group-hover:text-blue-600 transition-colors" />
                             </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="space-y-8">
                     <div className="bg-white dark:bg-[#0d101a] border border-slate-100 dark:border-white/5 rounded-[40px] p-10 shadow-sm">
                        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Personal Statistics</h3>
                        <div className="space-y-8">
                           {[
                             { label: 'Event Attendance', val: '94%', trend: '+3%' },
                             { label: 'Network Reach', val: '432 Users', trend: '+12' },
                             { label: 'Engagement Score', val: 'A+', trend: 'Steady' },
                             { label: 'Portfolio Health', val: 'Optimal', trend: 'N/A' },
                           ].map(s => (
                             <div key={s.label}>
                                <div className="flex justify-between items-end mb-2">
                                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                                   <span className="text-[10px] font-black text-blue-600">{s.trend}</span>
                                </div>
                                <p className="text-2xl font-black uppercase tracking-tight">{s.val}</p>
                             </div>
                           ))}
                        </div>
                        <button className="w-full mt-12 py-5 bg-blue-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20">Edit Public Profile</button>
                     </div>
                  </div>
               </div>
            </div>
         )}

      </main>

      {/* Floating Action for Mobile */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl px-8 py-4 flex md:hidden items-center gap-10 shadow-2xl z-50">
          <Compass className="h-6 w-6" onClick={() => setTab('discover')} />
          <Ticket className="h-6 w-6" onClick={() => setTab('passes')} />
          <Award className="h-6 w-6" onClick={() => setTab('campus')} />
          <User className="h-6 w-6" onClick={() => setTab('profile')} />
      </div>
    </div>
  );
};

export default StudentPortal;
