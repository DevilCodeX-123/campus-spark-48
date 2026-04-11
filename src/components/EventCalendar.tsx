import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ExternalLink, Filter, MapPin, Clock, Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Event {
  _id: string;
  title: string;
  date: string;
  venue: string;
  collegeId: any;
  category?: string;
  isPaid?: boolean;
}

const EventCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [view, setView] = useState<'month' | 'week'>('month');
  const [filterCollege, setFilterCollege] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events_calendar', format(currentMonth, 'yyyy-MM')],
    queryFn: () => api.get('/events').then(r => r.data).catch(() => []),
  });

  const { data: userRegs = [] } = useQuery({
    queryKey: ['user_registrations'],
    queryFn: () => api.get('/register/user').then(r => r.data).catch(() => []),
  });

  const registeredEventIds = new Set(userRegs.map((r: any) => r.eventId));

  const days = eachDayOfInterval({
    start: view === 'month' ? startOfWeek(startOfMonth(currentMonth)) : startOfWeek(new Date()),
    end: view === 'month' ? endOfWeek(endOfMonth(currentMonth)) : endOfWeek(new Date()),
  });

  const eventsOnDay = (day: Date) => events.filter((e: any) => isSameDay(new Date(e.date), day));

  const getGoogleCalendarUrl = (event: Event) => {
    const start = new Date(event.date).toISOString().replace(/-|:|\.\d\d\d/g, "");
    const end = new Date(new Date(event.date).getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/-|:|\.\d\d\d/g, "");
    return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${start}/${end}&details=${encodeURIComponent(event.venue)}&location=${encodeURIComponent(event.venue)}&sf=true&output=xml`;
  };

  return (
    <div className="bg-white dark:bg-[#090b14] rounded-[32px] border border-slate-100 dark:border-white/5 overflow-hidden shadow-sm">
      {/* Calendar Header */}
      <div className="p-8 border-b border-slate-50 dark:border-white/5 flex flex-wrap items-center justify-between gap-6 bg-slate-50/50 dark:bg-white/[0.01]">
        <div className="flex items-center gap-4">
           <div className="h-11 w-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <CalendarIcon className="h-5 w-5" />
           </div>
           <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">{format(currentMonth, 'MMMM yyyy')}</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Campus Event Schedule</p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <div className="flex bg-white dark:bg-white/5 p-1 rounded-xl border border-slate-100 dark:border-white/10 shadow-sm">
              <button onClick={() => setView('month')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'month' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-600'}`}>Month</button>
              <button onClick={() => setView('week')} className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${view === 'week' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-blue-600'}`}>Week</button>
           </div>
           <div className="flex gap-2">
              <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 hover:text-blue-600 transition-all"><ChevronLeft className="h-5 w-5" /></button>
              <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2.5 rounded-xl bg-white dark:bg-white/5 border border-slate-100 dark:border-white/10 text-slate-400 hover:text-blue-600 transition-all"><ChevronRight className="h-5 w-5" /></button>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4">
        {/* Sidebar Filters */}
        <div className="p-8 lg:border-r border-slate-50 dark:border-white/5 space-y-8 bg-slate-50/20 dark:bg-transparent">
           <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Event Categories</label>
              <div className="space-y-2">
                 {['Tech', 'Cultural', 'Sports', 'Workshop'].map((cat) => (
                    <button key={cat} onClick={() => setFilterCategory(cat === filterCategory ? '' : cat)} className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${filterCategory === cat ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white dark:bg-white/5 border-slate-100 dark:border-white/10 text-slate-500 hover:bg-slate-50'}`}>
                       {cat}
                       {filterCategory === cat && <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />}
                    </button>
                 ))}
              </div>
           </div>

           <div>
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 block">Legend</label>
              <div className="space-y-3">
                 <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest"><div className="h-2.5 w-2.5 rounded-full bg-blue-600 shadow-sm" /> Registered</div>
                 <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest"><div className="h-2.5 w-2.5 rounded-full bg-slate-200 dark:bg-white/20" /> Available</div>
                 <div className="flex items-center gap-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest"><div className="h-2.5 w-2.5 rounded-full border-2 border-blue-600" /> Today</div>
              </div>
           </div>
        </div>

        {/* Main Calendar Grid */}
        <div className="lg:col-span-3">
           <div className="grid grid-cols-7 border-b border-slate-50 dark:border-white/5">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                 <div key={d} className="py-4 text-center text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">{d}</div>
              ))}
           </div>
           <div className="grid grid-cols-7">
              {days.map((day, i) => {
                 const dayEvents = eventsOnDay(day);
                 const isToday = isSameDay(day, new Date());
                 const isSel = selectedDay && isSameDay(day, selectedDay);
                 const darkOut = !isSameMonth(day, currentMonth) && view === 'month';

                 return (
                    <div 
                       key={i} 
                       onClick={() => setSelectedDay(day)}
                       className={`min-h-[140px] p-4 border-r border-b border-slate-50 dark:border-white/5 transition-all cursor-pointer relative group ${darkOut ? 'opacity-30' : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'} ${isSel ? 'bg-blue-50/30 dark:bg-blue-600/[0.05]' : ''}`}
                    >
                       <span className={`inline-flex items-center justify-center h-7 w-7 rounded-lg text-xs font-black ${isToday ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 group-hover:text-blue-600'}`}>
                          {format(day, 'd')}
                       </span>

                       <div className="mt-3 space-y-1.5">
                          {dayEvents.slice(0, 3).map((e: any, idx) => (
                             <div key={idx} className={`px-2 py-1 rounded-md text-[8.5px] font-black uppercase tracking-tighter truncate ${registeredEventIds.has(e._id) ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-400'}`}>
                                {e.title}
                             </div>
                          ))}
                          {dayEvents.length > 3 && <p className="text-[8px] font-black text-slate-300 ml-1 uppercase">+ {dayEvents.length - 3} MORE</p>}
                       </div>
                    </div>
                 );
              })}
           </div>
        </div>
      </div>

      {/* Selected Day Modal/Panel (Simulation) */}
      {selectedDay && eventsOnDay(selectedDay).length > 0 && (
         <div className="p-8 bg-blue-600 text-white animate-in slide-in-from-bottom fixed bottom-10 right-10 left-82 z-50 rounded-[32px] shadow-2xl shadow-blue-600/40">
            <div className="flex items-center justify-between mb-8">
               <h3 className="text-xl font-black uppercase tracking-tight italic">Missions for {format(selectedDay, 'MMM dd, yyyy')}</h3>
               <button onClick={() => setSelectedDay(null)} className="p-2 hover:bg-white/10 rounded-full Transition-all"><Plus className="h-6 w-6 rotate-45" /></button>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {eventsOnDay(selectedDay).map((e: any, i) => (
                  <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[24px] group">
                     <p className="text-sm font-black uppercase tracking-tight mb-4">{e.title}</p>
                     <div className="space-y-2 mb-6 opacity-80">
                        <p className="text-[10px] font-bold uppercase flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {e.venue}</p>
                        <p className="text-[10px] font-bold uppercase flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {format(new Date(e.date), 'hh:mm a')}</p>
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => window.open(getGoogleCalendarUrl(e), '_blank')} className="flex-1 py-3 bg-white text-blue-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"><ExternalLink className="h-3.5 w-3.5" /> Google Cal</button>
                        <button className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-all"><Clock className="h-4 w-4" /></button>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      )}
    </div>
  );
};

export default EventCalendar;
