import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/utils/api';
import Navbar from '@/components/Navbar';
import EventCard from '../components/EventCard';
import { Search, Calendar, Loader2, MapPin, Users, Filter, Building2, AlertTriangle, RefreshCw } from 'lucide-react';
import { EVENT_CATEGORIES } from '@/types';

const EventsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [collegeId, setCollegeId] = useState('all');

  const { data: events, isLoading, error, refetch } = useQuery({
    queryKey: ['events', category, collegeId],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category !== 'all') params.append('category', category);
      if (collegeId !== 'all') params.append('collegeId', collegeId);
      const res = await api.get(`/events?${params.toString()}`);
      
      // Safety check: ensure response data is an array
      if (!Array.isArray(res.data)) {
        console.error('API Error: Expected array of events, got:', res.data);
        return [];
      }
      return res.data;
    },
    retry: 1
  });

  const { data: colleges = [] } = useQuery({
    queryKey: ['colleges'],
    queryFn: async () => {
      const res = await api.get('/auth/colleges');
      return Array.isArray(res.data) ? res.data : [];
    }
  });

  // Calculate filtered events with defensive checks
  const filteredEvents = Array.isArray(events) 
    ? events.filter((e: any) => {
        const title = (e.title || '').toLowerCase();
        const collegeName = (e.collegeName || '').toLowerCase();
        const searchLower = search.toLowerCase();
        return title.includes(searchLower) || collegeName.includes(searchLower);
      })
    : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="font-heading text-4xl font-extrabold tracking-tight">Discover Events</h1>
          <p className="mt-2 text-muted-foreground">Find and register for the most exciting campus happenings.</p>
        </header>

        {/* Search & Filters */}
        <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text" 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by event title or college name..." 
              className="w-full rounded-2xl border border-border bg-card py-4 pl-12 pr-6 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 shadow-sm">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none"
              >
                <option value="all">All Categories</option>
                {EVENT_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border border-border bg-card px-4 py-2 shadow-sm">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <select 
                value={collegeId} 
                onChange={e => setCollegeId(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none"
              >
                <option value="all">Every College</option>
                {colleges.map((c: any) => (
                  <option key={c?._id || c?.id} value={c?._id || c?.id}>{c?.name || 'Unknown College'}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content States */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground font-medium">Loading events...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-destructive/20 bg-destructive/5">
            <AlertTriangle className="h-16 w-16 text-destructive/50" />
            <h3 className="mt-4 text-xl font-bold text-foreground">Connection Error</h3>
            <p className="mt-2 text-muted-foreground text-center max-w-xs">
              We couldn't reach the event service. Please ensure the backend is running and you are connected to the network.
            </p>
            <button 
              onClick={() => refetch()} 
              className="mt-6 flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90"
            >
              <RefreshCw className="h-4 w-4" /> Try Again
            </button>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 rounded-3xl border border-dashed border-border bg-muted/30">
            <Calendar className="h-16 w-16 text-muted-foreground/30" />
            <h3 className="mt-4 text-xl font-bold text-foreground">No events found</h3>
            <p className="mt-2 text-muted-foreground text-center max-w-xs">We couldn't find any events matching your current filters. Try adjusting your search.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((e: any) => (
              <EventCard key={e?._id || e?.id} event={e} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
