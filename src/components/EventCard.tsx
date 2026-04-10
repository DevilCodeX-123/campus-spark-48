import React from 'react';
import { Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  // Defensive mapping for MongoDB _id vs frontend id
  const eventId = event.id || (event as any)._id;
  
  // Fallbacks for missing data
  const title = event.title || 'Untitled Event';
  const college = event.collegeName || 'Unknown College';
  const venue = event.venue || 'TBA';
  const category = event.category || 'Misc';
  const date = event.date || 'TBA';
  const time = event.time || '';

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 w-full overflow-hidden bg-muted">
        {event.coverImage ? (
          <img 
            src={event.coverImage} 
            alt={title} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
            <Calendar className="h-12 w-12 text-primary/20" />
          </div>
        )}
        <div className="absolute top-4 right-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary shadow-sm backdrop-blur-sm">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-heading text-xl font-bold text-foreground line-clamp-1">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-1">{college}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{date} {time ? `• ${time}` : ''}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="line-clamp-1">{venue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4 text-primary" />
            <span>{(event.seatsLeft ?? 0)}/{(event.capacity ?? 0)} seats left</span>
          </div>
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <div className="text-lg font-bold text-foreground">
            {event.isFree ? (
              <span className="text-success">Free</span>
            ) : (
              `₹${event.price ?? 0}`
            )}
          </div>
          <Link 
            to={`/student/events/${eventId}`} 
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-sm hover:opacity-90 transition-all"
          >
            Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
