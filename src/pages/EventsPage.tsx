import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { mockEvents } from '@/data/mockData';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const EventsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [collegeFilter, setCollegeFilter] = useState('all');

  const categories = ['all', ...new Set(mockEvents.map(e => e.category))];
  const colleges = ['all', ...new Set(mockEvents.map(e => e.collegeName))];

  const filtered = mockEvents.filter(e => {
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === 'all' || e.category === category;
    const matchCollege = collegeFilter === 'all' || e.collegeName === collegeFilter;
    return matchSearch && matchCat && matchCollege;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="font-heading text-3xl font-bold text-foreground">All Events</h1>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search events..." className="w-full rounded-lg border border-input bg-background py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <select value={category} onChange={e => setCategory(e.target.value)}
            className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
          <select value={collegeFilter} onChange={e => setCollegeFilter(e.target.value)}
            className="rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
            {colleges.map(c => <option key={c} value={c}>{c === 'all' ? 'All Colleges' : c}</option>)}
          </select>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(e => (
            <div key={e.id} className="group rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                <Calendar className="h-10 w-10 text-primary/30" />
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{e.category}</span>
                  {!e.isFree && <span className="text-sm font-semibold text-warning">₹{e.price}</span>}
                  {e.isFree && <span className="text-xs font-medium text-success">Free</span>}
                </div>
                <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">{e.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{e.description}</p>
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {e.date} • {e.time}</p>
                  <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {e.venue}</p>
                  <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {e.seatsLeft}/{e.capacity} seats</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{e.collegeName}</p>
              </div>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">No events found matching your criteria.</div>
        )}
      </div>
    </div>
  );
};

export default EventsPage;
