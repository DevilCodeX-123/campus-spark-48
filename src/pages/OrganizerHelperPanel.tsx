import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/ThemeToggle';
import {
  Calendar, Users, QrCode, CheckCircle, XCircle, Loader2,
  Search, LogOut, Play, Square, Ban, ScanLine, Menu, X,
  UserCheck, Zap
} from 'lucide-react';

const TABS = [
  { id: 'events',    label: 'My Events',    icon: Calendar },
  { id: 'scanner',  label: 'QR Scanner',   icon: QrCode },
  { id: 'attendees',label: 'Attendees',    icon: Users },
  { id: 'controls', label: 'Event Status', icon: Zap },
];

const STATUS_COLORS: Record<string, string> = {
  upcoming:  'bg-yellow-100 text-yellow-700 border-yellow-200',
  ongoing:   'bg-green-100 text-green-700 border-green-200',
  completed: 'bg-slate-100 text-slate-500 border-slate-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const OrganizerHelperPanel: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('events');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrInput, setQrInput] = useState('');
  const [qrResult, setQrResult] = useState<{ status: string; message: string } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [checkInMap, setCheckInMap] = useState<Record<string, boolean>>({});

  const { data: events = [], isLoading: loadingEvents } = useQuery({
    queryKey: ['helper_events'],
    queryFn: () => api.get('/events').then(r => r.data).catch(() => []),
  });

  const { data: registrations = [], isLoading: loadingRegs } = useQuery({
    queryKey: ['helper_regs'],
    queryFn: () => api.get('/register/all').then(r => r.data).catch(() => []),
  });

  const allEvents = Array.isArray(events) ? events : [];
  const assignedEvents = allEvents.slice(0, 4); // Helper sees assigned events
  const allRegs = Array.isArray(registrations) ? registrations : [];

  const filteredAttendees = allRegs.filter((r: any) =>
    (r.userName || '').toLowerCase().includes(attendeeSearch.toLowerCase()) ||
    (r.qrCode || '').toLowerCase().includes(attendeeSearch.toLowerCase())
  );

  const handleLogout = () => { logout(); navigate('/'); };

  const handleQRScan = () => {
    if (!qrInput.trim()) { toast.error('Please enter a QR code'); return; }
    setScanning(true);
    setTimeout(() => {
      const found = allRegs.find((r: any) => r.qrCode === qrInput.trim());
      if (found) {
        setQrResult({ status: 'success', message: `✅ Valid! ${found.userName || 'Student'} — ${found.eventTitle || 'Event'}` });
        setCheckInMap(prev => ({ ...prev, [found._id]: true }));
      } else {
        setQrResult({ status: 'error', message: '❌ Invalid QR Code. Participant not found in database.' });
      }
      setScanning(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background">
      {/* ──── MOBILE-FIRST TOP NAV ──── */}
      <header className="sticky top-0 z-30 bg-white dark:bg-card border-b-2 border-yellow-400/60 dark:border-yellow-500/30 shadow-lg shadow-yellow-100/30 dark:shadow-none">
        <div className="flex items-center justify-between px-4 py-4 max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/20 dark:bg-yellow-500/15 border-2 border-yellow-400/30">
              <Zap className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <p className="text-base font-black text-slate-900 dark:text-white leading-none">Event Assistant</p>
              <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 leading-none mt-0.5">{user?.college || 'CampusConnect'}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="flex items-center gap-2 rounded-full bg-yellow-100 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-500/20 px-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-yellow-400/30 dark:bg-yellow-500/20 text-sm font-black text-yellow-700 dark:text-yellow-400">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 hidden sm:block">{user?.name?.split(' ')[0]}</span>
            </div>
            <button onClick={handleLogout} className="rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-500/5 p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-500/10 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Tab bar — large tap targets */}
        <div className="flex border-t border-slate-100 dark:border-border overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setMobileMenuOpen(false); }}
                className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 min-h-[64px] text-xs font-bold transition-all border-b-2 ${isActive ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400 bg-yellow-50/80 dark:bg-yellow-500/5' : 'border-transparent text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-muted/30'}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-yellow-500' : ''}`} />
                <span className="hidden sm:block">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">

        {/* ── MY EVENTS ── */}
        {activeTab === 'events' && (
          <div className="space-y-4 animate-in fade-in duration-400">
            <h2 className="font-heading text-xl font-black text-slate-900 dark:text-white">Assigned Events</h2>
            {loadingEvents ? (
              <div className="flex flex-col items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-yellow-500" /></div>
            ) : assignedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-yellow-200 dark:border-yellow-900/30 bg-yellow-50/30 dark:bg-yellow-500/3 py-16">
                <Calendar className="h-14 w-14 text-yellow-300 dark:text-yellow-700 mb-3" />
                <p className="font-bold text-slate-500">No events assigned yet.</p>
                <p className="text-sm text-slate-400 mt-1">Contact your Event Head to get assigned.</p>
              </div>
            ) : assignedEvents.map((e: any) => (
              <div key={e._id} className="helper-card flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {/* Image thumbnail */}
                <div className="h-24 w-24 shrink-0 rounded-xl overflow-hidden bg-yellow-100/50 dark:bg-yellow-500/10 flex items-center justify-center">
                  {e.coverImage ? <img src={e.coverImage} alt={e.title} className="h-full w-full object-cover" /> : <Calendar className="h-8 w-8 text-yellow-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg">{e.title}</h3>
                    <span className={`rounded-full border px-3 py-0.5 text-xs font-black uppercase ${STATUS_COLORS[e.status || 'upcoming'] || STATUS_COLORS['upcoming']}`}>{e.status || 'upcoming'}</span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{e.collegeName}</p>
                  <p className="mt-0.5 text-sm font-medium text-slate-600 dark:text-slate-300">{e.date} · {e.venue || 'TBA'}</p>
                  <div className="mt-2 flex items-center gap-4">
                    <span className={`text-sm font-bold ${e.isFree ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'}`}>{e.isFree ? 'FREE' : `₹${e.price}`}</span>
                    <span className="text-xs text-slate-400">{e.seatsLeft ?? e.capacity} / {e.capacity} seats</span>
                  </div>
                </div>
                <button onClick={() => { setActiveTab('scanner'); }} className="shrink-0 flex items-center gap-2 rounded-xl bg-yellow-400 dark:bg-yellow-500 px-5 py-3 text-sm font-black text-yellow-900 hover:bg-yellow-300 dark:hover:bg-yellow-400 transition-all active:scale-95 shadow-md shadow-yellow-200/50 dark:shadow-yellow-500/10">
                  <ScanLine className="h-4 w-4" /> Scan Entry
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── QR SCANNER ── */}
        {activeTab === 'scanner' && (
          <div className="space-y-5 animate-in fade-in duration-400">
            <h2 className="font-heading text-xl font-black text-slate-900 dark:text-white">QR Code Scanner</h2>

            {/* Camera-style UI */}
            <div className="rounded-3xl border-2 border-yellow-400/60 dark:border-yellow-500/30 overflow-hidden bg-white dark:bg-card shadow-xl shadow-yellow-100/30 dark:shadow-none">
              {/* Viewfinder area */}
              <div className="relative flex flex-col items-center justify-center bg-slate-900 h-64">
                <div className="absolute inset-8 border-2 border-yellow-400/70 rounded-3xl">
                  {/* Corner markers */}
                  {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
                    <div key={i} className={`absolute ${pos} w-6 h-6 border-4 border-yellow-400 ${i < 2 ? 'border-b-0' : 'border-t-0'} ${i % 2 === 0 ? 'border-r-0' : 'border-l-0'} rounded-lg`}></div>
                  ))}
                  {scanning && <div className="absolute inset-0 overflow-hidden rounded-3xl"><div className="absolute inset-x-0 h-0.5 bg-yellow-400/80 animate-bounce top-1/2 shadow-lg shadow-yellow-400/50"></div></div>}
                </div>
                {scanning
                  ? <><Loader2 className="h-10 w-10 animate-spin text-yellow-400" /><p className="mt-3 text-yellow-400 font-bold text-sm">Verifying QR Code...</p></>
                  : <><QrCode className="h-16 w-16 text-yellow-400/30" /><p className="mt-3 text-slate-400 text-sm">Point camera at QR code</p></>
                }
              </div>

              {/* Manual entry */}
              <div className="p-6 space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Or enter QR code manually</p>
                <div className="flex gap-3">
                  <input
                    value={qrInput} onChange={e => setQrInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleQRScan()}
                    placeholder="Paste or type QR code value..."
                    className="flex-1 rounded-2xl border-2 border-slate-200 dark:border-border bg-slate-50 dark:bg-muted/50 px-5 py-4 text-base font-medium text-slate-800 dark:text-white placeholder:text-slate-300 focus:outline-none focus:border-yellow-400 dark:focus:border-yellow-500 transition-colors"
                  />
                  <button onClick={handleQRScan} disabled={scanning}
                    className="rounded-2xl bg-yellow-400 dark:bg-yellow-500 px-6 py-4 font-black text-yellow-900 text-base hover:bg-yellow-300 dark:hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-200/50 dark:shadow-yellow-500/10 disabled:opacity-50 flex items-center gap-2">
                    <ScanLine className="h-5 w-5" /> Verify
                  </button>
                </div>

                {/* Result */}
                {qrResult && (
                  <div className={`rounded-2xl border-2 p-5 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-300 ${qrResult.status === 'success' ? 'border-green-200 dark:border-green-500/20 bg-green-50 dark:bg-green-500/5' : 'border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/5'}`}>
                    {qrResult.status === 'success'
                      ? <CheckCircle className="h-8 w-8 text-green-500 shrink-0 mt-0.5" />
                      : <XCircle className="h-8 w-8 text-red-500 shrink-0 mt-0.5" />
                    }
                    <div>
                      <p className={`font-bold text-base ${qrResult.status === 'success' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>{qrResult.message}</p>
                      <button onClick={() => { setQrResult(null); setQrInput(''); }} className="mt-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors underline">
                        Scan Another
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ATTENDEES ── */}
        {activeTab === 'attendees' && (
          <div className="space-y-4 animate-in fade-in duration-400">
            <h2 className="font-heading text-xl font-black text-slate-900 dark:text-white">Attendee Check-In</h2>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <input value={attendeeSearch} onChange={e => setAttendeeSearch(e.target.value)} placeholder="Search by name or QR code..."
                className="w-full rounded-2xl border-2 border-slate-200 dark:border-border bg-white dark:bg-card pl-12 pr-4 py-4 text-sm font-medium text-slate-800 dark:text-white placeholder:text-slate-300 focus:outline-none focus:border-yellow-400 transition-colors shadow-sm"
              />
            </div>
            <div className="space-y-3">
              {loadingRegs ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-yellow-500" /></div>
              ) : filteredAttendees.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-yellow-200 dark:border-yellow-900/30 py-16">
                  <Users className="h-12 w-12 text-yellow-200 dark:text-yellow-800 mb-3" />
                  <p className="font-bold text-slate-400">No participants found.</p>
                </div>
              ) : filteredAttendees.map((r: any) => {
                const isCheckedIn = checkInMap[r._id] || r.checkedIn;
                return (
                  <div key={r._id} className={`helper-card flex items-center gap-4 transition-all ${isCheckedIn ? 'border-green-100 dark:border-green-900/20 bg-green-50/30 dark:bg-green-500/3' : ''}`}>
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${isCheckedIn ? 'bg-green-100 dark:bg-green-500/15 text-green-600 dark:text-green-400' : 'bg-yellow-100 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'}`}>
                      {(r.userName || 'U').charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 dark:text-white">{r.userName || 'Unknown'}</p>
                      <p className="text-xs text-slate-500 truncate">{r.userEmail || '—'} · {r.eventTitle || '—'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setCheckInMap(prev => ({ ...prev, [r._id]: !prev[r._id] }));
                        toast.success(isCheckedIn ? 'Check-in removed' : `${r.userName} checked in!`);
                      }}
                      className={`shrink-0 min-h-[48px] flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-black transition-all active:scale-95 ${isCheckedIn ? 'bg-green-500 text-white hover:bg-green-400 shadow-md shadow-green-200/50 dark:shadow-green-500/10' : 'bg-slate-100 dark:bg-muted text-slate-500 hover:bg-yellow-400 dark:hover:bg-yellow-500 hover:text-yellow-900'}`}
                    >
                      {isCheckedIn ? <><CheckCircle className="h-4 w-4" /> Done</> : <><UserCheck className="h-4 w-4" /> Check In</>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── EVENT STATUS CONTROLS ── */}
        {activeTab === 'controls' && (
          <div className="space-y-5 animate-in fade-in duration-400">
            <h2 className="font-heading text-xl font-black text-slate-900 dark:text-white">Event Status Controls</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Manage the live status of assigned events. Changes are reflected in real-time for all participants.</p>

            {assignedEvents.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-yellow-200 dark:border-yellow-900/30 py-16">
                <Calendar className="h-12 w-12 text-yellow-200 dark:text-yellow-800 mb-3" />
                <p className="font-bold text-slate-400">No events assigned to manage.</p>
              </div>
            ) : assignedEvents.map((e: any) => (
              <div key={e._id} className="helper-card">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="font-heading font-bold text-slate-900 dark:text-white text-lg">{e.title}</h3>
                    <p className="text-sm text-slate-400 mt-0.5">{e.date} · {e.venue || 'TBA'}</p>
                  </div>
                  <span className={`rounded-full border px-3 py-1 text-xs font-black uppercase ${STATUS_COLORS[e.status || 'upcoming']}`}>{e.status || 'upcoming'}</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <button onClick={() => toast.success(`${e.title} — Marked as ONGOING`)}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-green-50 dark:bg-green-500/10 border-2 border-green-200 dark:border-green-500/20 px-4 py-5 font-black text-green-700 dark:text-green-400 text-sm hover:bg-green-500 hover:text-white dark:hover:bg-green-500/20 transition-all active:scale-95">
                    <Play className="h-7 w-7" /> Start Event
                  </button>
                  <button onClick={() => toast.success(`${e.title} — Marked as COMPLETED`)}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-slate-50 dark:bg-muted border-2 border-slate-200 dark:border-border px-4 py-5 font-black text-slate-600 dark:text-slate-400 text-sm hover:bg-slate-500 hover:text-white dark:hover:bg-slate-500/20 transition-all active:scale-95">
                    <Square className="h-7 w-7" /> End Event
                  </button>
                  <button onClick={() => toast.error(`${e.title} — Marked as CANCELLED`)}
                    className="flex flex-col items-center gap-2 rounded-2xl bg-red-50 dark:bg-red-500/10 border-2 border-red-200 dark:border-red-500/20 px-4 py-5 font-black text-red-600 dark:text-red-400 text-sm hover:bg-red-500 hover:text-white dark:hover:bg-red-500/20 transition-all active:scale-95">
                    <Ban className="h-7 w-7" /> Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default OrganizerHelperPanel;
