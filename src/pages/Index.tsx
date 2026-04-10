import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { mockEvents } from '@/data/mockData';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const Index: React.FC = () => {
  const upcomingEvents = mockEvents.filter(e => e.status === 'upcoming').slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-4 py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/3" />
        <div className="container relative mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              AI-Powered Campus Events
            </span>
            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
              Connect. Create.<br />Celebrate.
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              The all-in-one platform for managing college events. From hackathons to cultural nights — 
              organize, register, and check in with ease.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/signup" className="rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-95">
                Get Started Free
              </Link>
              <Link to="/events" className="flex items-center gap-2 rounded-xl border border-border bg-card px-8 py-3 font-medium text-foreground transition-all hover:bg-accent">
                Browse Events <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border px-4 py-20">
        <div className="container mx-auto">
          <h2 className="text-center font-heading text-3xl font-bold text-foreground">Why CampusConnect?</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: <Sparkles className="h-6 w-6" />, title: 'Smart Management', desc: '5-tier role hierarchy for granular access control across your entire campus' },
              { icon: <Zap className="h-6 w-6" />, title: 'Real-time Seats', desc: 'Live seat tracking with 90-second hold system and QR code check-ins' },
              { icon: <Shield className="h-6 w-6" />, title: 'Budget Tracking', desc: 'Category-wise budget allocation with visual charts and spending alerts' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-card p-8 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {f.icon}
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="border-t border-border px-4 py-20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-3xl font-bold text-foreground">Upcoming Events</h2>
            <Link to="/events" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {upcomingEvents.map(e => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md overflow-hidden"
              >
                <div className="h-36 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <Calendar className="h-12 w-12 text-primary/30" />
                </div>
                <div className="p-5">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">{e.category}</span>
                  <h3 className="mt-2 font-heading text-lg font-semibold text-foreground">{e.title}</h3>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <p className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {e.date} • {e.time}</p>
                    <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {e.venue}</p>
                    <p className="flex items-center gap-2"><Users className="h-3.5 w-3.5" /> {e.seatsLeft} seats left</p>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{e.collegeName}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border px-4 py-20">
        <div className="container mx-auto text-center">
          <h2 className="font-heading text-3xl font-bold text-foreground">Ready to transform your campus events?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join colleges across India using CampusConnect to streamline event management.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/signup" className="rounded-xl bg-primary px-8 py-3 font-medium text-primary-foreground hover:opacity-90">
              Sign Up as Student
            </Link>
            <Link to="/register-college" className="rounded-xl border border-border bg-card px-8 py-3 font-medium text-foreground hover:bg-accent">
              Register Your College
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-8">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">© 2024 CampusConnect. All rights reserved.</p>
          
          {/* Real-time System Status Indicator */}
          <div className="flex items-center gap-4 rounded-full border border-border bg-background/50 px-4 py-1.5 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">System Health</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[11px] font-medium text-foreground">Auth</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[11px] font-medium text-foreground">Events</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                <span className="text-[11px] font-medium text-foreground">Database</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
