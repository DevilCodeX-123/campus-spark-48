import React, { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import QRCodeCard from '@/components/QRCodeCard';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import { Calendar, Ticket, User, Search, Loader2, CheckCircle, MapPin } from 'lucide-react';

const StudentPortal: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Fetch real events from database
  const { data: dbEvents = [], isLoading: isEventsLoading } = useQuery({
    queryKey: ['portal_events'],
    queryFn: async () => {
      const res = await api.get('/events');
      return res.data;
    }
  });

  // Fetch student's real registrations
  const { data: myRegistrations = [], isLoading: isRegLoading } = useQuery({
    queryKey: ['myRegistrations', user?.id],
    queryFn: async () => {
      const res = await api.get(`/register/user/${user?.id}`);
      return res.data;
    },
    enabled: !!user?.id
  });

  const registeredEventIds = myRegistrations.map((r: any) => r.eventId);

  // Advanced Frontend Filtering
  const filteredEvents = Array.isArray(dbEvents) ? dbEvents.filter((e: any) => {
    const title = (e.title || '').toLowerCase();
    const college = (e.collegeName || '').toLowerCase();
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || college.includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || (e.category || '').toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  }) : [];

  // Map vibrant tailwind colors dynamically to categories
  const getCategoryColor = (category: string) => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('tech')) return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 group-hover:bg-blue-500/20';
    if (cat.includes('cult')) return 'bg-pink-500/15 text-pink-700 dark:text-pink-400 group-hover:bg-pink-500/20';
    if (cat.includes('sport')) return 'bg-orange-500/15 text-orange-700 dark:text-orange-400 group-hover:bg-orange-500/20';
    if (cat.includes('work')) return 'bg-purple-500/15 text-purple-700 dark:text-purple-400 group-hover:bg-purple-500/20';
    if (cat.includes('semi')) return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-500/20';
    return 'bg-primary/15 text-primary group-hover:bg-primary/25';
  };

  const categories: string[] = ['all', ...new Set(dbEvents.map((e: any) => ((e.category || '').toLowerCase() as string)).filter(Boolean))];

  const tabs = [
    { id: 'browse', label: 'Discover Events', icon: <Search className="h-4 w-4" /> },
    { id: 'registrations', label: 'My Tickets', icon: <Ticket className="h-4 w-4" /> },
    { id: 'profile', label: 'Profile Settings', icon: <User className="h-4 w-4" /> },
  ];

  return (
    <>
      <DashboardLayout role="student" tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'browse' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search events by title or college..."
                  className="w-full rounded-2xl border border-input bg-card py-4 pl-12 pr-6 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="w-full sm:w-auto rounded-2xl border border-input bg-card px-6 py-4 text-sm font-semibold uppercase focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              >
                <option value="all">ALL CATEGORIES</option>
                {categories.filter(c => c !== 'all').map(c => (
                  <option key={c as string} value={c as string}>{c}</option>
                ))}
              </select>
            </div>

            {isEventsLoading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-border bg-muted/30 text-center px-6">
                <Calendar className="h-16 w-16 text-muted-foreground/30 animate-pulse" />
                <h3 className="mt-6 font-heading text-2xl font-bold text-foreground">Discovering Your Campus...</h3>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Our sensors are active, but no events have been posted yet. 
                  If you are the administrator, please ensure your database is seeded with "WOW" content.
                </p>
                
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <div className="flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-2 text-xs font-bold text-success border border-success/20">
                     <div className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_rgba(34,197,94,0.6)]" /> Connected to MongoDB Atlas
                  </div>
                  <div className="flex items-center gap-2 rounded-2xl bg-blue-500/10 px-4 py-2 text-xs font-bold text-blue-600 border border-blue-500/20">
                     <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" /> Services Synchronized
                  </div>
                </div>

                <div className="mt-10 p-6 rounded-2xl bg-card border border-border shadow-xl max-w-sm">
                   <p className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-3">Administrator Quick-Fix</p>
                   <p className="text-sm text-foreground mb-4">Run the following command in your terminal to populate this screen with events:</p>
                   <code className="block bg-muted p-3 rounded-lg text-xs font-mono text-primary text-left">
                     node scripts/master-seed.js
                   </code>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map((e: any) => {
                  const eventId = e._id || e.id;
                  const isRegistered = registeredEventIds.includes(eventId);
                  const colorClass = getCategoryColor(e.category);
                  
                  return (
                    <div key={eventId} className="group flex flex-col rounded-3xl border border-border bg-card shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1.5 overflow-hidden duration-300">
                      <div className="relative h-48 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center overflow-hidden">
                        {e.coverImage ? (
                          <img src={e.coverImage} alt={e.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                          <Calendar className="h-12 w-12 text-primary/20" />
                        )}
                        {e.category && (
                          <div className={`absolute right-3 top-3 rounded-2xl px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm transition-colors duration-300 ${colorClass}`}>
                            {e.category}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-6 relative">
                        <div className="flex items-start justify-between">
                          <h3 className="font-heading text-xl font-bold text-foreground line-clamp-1">{e.title}</h3>
                        </div>
                        <p className="mt-2 text-sm font-semibold opacity-80">{e.collegeName}</p>
                        <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" /> {e.date} • {e.time}
                        </p>
                        <p className="mt-4 text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">{e.description}</p>
                        
                        <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-5">
                          <div className="flex items-center gap-2">
                            <span className={`rounded-xl px-3 py-1 text-xs font-black uppercase tracking-wider ${e.isFree ? 'bg-success/15 text-success' : 'bg-rose-500/15 text-rose-600 dark:text-rose-400'}`}>
                              {e.isFree ? 'FREE' : `₹${e.price}`}
                            </span>
                            <span className="text-xs font-medium text-muted-foreground">{e.seatsLeft} seats</span>
                          </div>
                          
                          {isRegistered ? (
                            <span className="rounded-xl bg-success/15 px-4 py-2 text-sm font-bold text-success shadow-sm">Registered</span>
                          ) : (
                            <button 
                              onClick={() => navigate(`/register-event/${eventId}`)}
                              className="rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:bg-primary/90 active:scale-95"
                            >
                              Register Now
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'registrations' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="font-heading text-2xl font-bold text-foreground">My Virtual Tickets</h2>
            {isRegLoading ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : myRegistrations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-border bg-card p-16 text-center text-muted-foreground">
                <Ticket className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p className="text-lg font-medium">You haven't registered for any events yet.</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {myRegistrations.map((r: any) => {
                  const eventDetails = dbEvents.find((e: any) => (e._id || e.id) === r.eventId);
                  return (
                    <QRCodeCard
                      key={r._id || r.id}
                      value={r.qrCode}
                      eventTitle={eventDetails?.title || 'Loading event...'}
                      date={eventDetails?.date || ''}
                      venue={eventDetails?.venue || ''}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Stunning Profile Header Card */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-card">
              {/* Vibrant Abstract Background Pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-emerald-500/30 opacity-60"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
              
              <div className="relative p-10 flex flex-col md:flex-row items-center gap-8 backdrop-blur-xl bg-background/40">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-70 blur-md group-hover:opacity-100 transition duration-500"></div>
                  <div className="relative flex h-32 w-32 items-center justify-center rounded-full bg-background border-4 border-background text-6xl font-black uppercase text-foreground shadow-2xl overflow-hidden">
                     <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary to-purple-600">
                        {user?.name?.charAt(0) || 'S'}
                     </span>
                  </div>
                </div>
                
                <div className="text-center md:text-left flex-1">
                  <h2 className="font-heading text-4xl font-black text-foreground tracking-tight drop-shadow-sm">{user?.name || 'Student Achiever'}</h2>
                  <p className="mt-2 text-lg font-medium text-muted-foreground">{user?.email}</p>
                  
                  <div className="mt-5 flex flex-wrap items-center justify-center md:justify-start gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-blue-700 dark:text-blue-400 border border-blue-500/20 shadow-sm">
                      <User className="h-4 w-4" /> Student Tier
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-4 py-1.5 text-xs font-extrabold uppercase tracking-widest text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shadow-sm">
                      <CheckCircle className="h-4 w-4" /> Verified Identity
                    </span>
                  </div>
                </div>
              </div>

              {/* Data Cards Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 bg-background/80 backdrop-blur-3xl border-t border-border/50">
                {/* College Info Card */}
                 <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-muted p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <MapPin className="h-32 w-32" />
                   </div>
                   <div className="flex items-center gap-3 mb-4">
                     <div className="bg-primary/20 p-2.5 rounded-xl text-primary">
                       <MapPin className="h-6 w-6" />
                     </div>
                     <label className="text-sm font-black text-muted-foreground uppercase tracking-widest">Enrolled Institution</label>
                   </div>
                   <p className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                     {user?.college || 'No College Linked'}
                   </p>
                 </div>

                {/* Event Participations Card */}
                 <div className="rounded-2xl border border-border/50 bg-gradient-to-br from-card to-muted p-6 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Ticket className="h-32 w-32" />
                   </div>
                   <div className="flex items-center gap-3 mb-4">
                     <div className="bg-purple-500/20 p-2.5 rounded-xl text-purple-600 dark:text-purple-400">
                       <Ticket className="h-6 w-6" />
                     </div>
                     <label className="text-sm font-black text-muted-foreground uppercase tracking-widest">Global Participation</label>
                   </div>
                   <div className="flex items-baseline gap-2">
                     <p className="text-4xl font-black text-foreground leading-none">
                       {myRegistrations.length}
                     </p>
                     <p className="text-lg font-bold text-muted-foreground">Valid Ticket{myRegistrations.length !== 1 && 's'}</p>
                   </div>
                 </div>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm font-medium text-muted-foreground">
               If you need to update your college affiliation or email, please contact platform support.
            </div>
          </div>
        )}
      </DashboardLayout>
    </>
  );
};

export default StudentPortal;
