import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Calendar, MapPin, Users, Ticket, Smartphone, CheckCircle, PlusCircle, Trash2, User } from 'lucide-react';

const EventRegistrationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    branch: '',
    year: '',
    teamMembers: [] as any[]
  });

  // Perfection Sync: High-stability effect to pull user data
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: prev.name || user.name || '',
        email: prev.email || user.email || '',
        college: prev.college || (user as any).collegeName || (user as any).college || ''
      }));
    }
  }, [user]);

  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', college: '', branch: '', year: '' });

  const { data: event, isLoading: isLoadingEvent, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      const res = await api.get('/events');
      const allEvents = Array.isArray(res.data) ? res.data : [];
      const ev = allEvents.find((e: any) => e._id === eventId || e.id === eventId);
      if (!ev) throw new Error('Event not found');
      return ev;
    },
    enabled: !!eventId
  });

  const registerMutation = useMutation({
    mutationFn: async () => {
      await api.post('/register/hold', { eventId });
      const res = await api.post('/register/confirm', {
        eventId,
        collegeId: formData.college || 'unspecified'
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success('🎉 Successfully registered!');
      queryClient.invalidateQueries({ queryKey: ['myRegistrations'] });
      queryClient.invalidateQueries({ queryKey: ['portal_events'] });
      navigate('/student');
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  });

  if (isLoadingEvent) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="mt-4 font-medium text-muted-foreground">Loading event details...</p>
    </div>
  );

  if (error || !event) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold">Event Not Found</h2>
      <button onClick={() => navigate('/student')} className="mt-4 text-primary underline">Return to Portal</button>
    </div>
  );

  const isTeam = event.isTeamEvent || false;
  const maxTeamMembers = event.teamSize ? parseInt(event.teamSize) : 5;
  const isPaid = !event.isFree;

  const handleAddMember = () => {
    if (formData.teamMembers.length >= maxTeamMembers) {
      toast.error(`Limit of ${maxTeamMembers} reached!`);
      return;
    }
    if (!newMember.name || !newMember.email || !newMember.phone || !newMember.branch || !newMember.year) {
      toast.error('Please fill all team member details');
      return;
    }
    setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, newMember] }));
    setNewMember({ name: '', email: '', phone: '', college: formData.college, branch: '', year: '' });
  };

  const currentStepIsValid = () => {
    if (step === 1) return !!(formData.name && formData.email && formData.phone && formData.college && formData.branch && formData.year);
    if (step === 2 && isTeam) return formData.teamMembers.length > 0;
    return true;
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        <button onClick={() => navigate('/student')} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Discover
        </button>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-md">
              <div className="h-32 bg-primary/10 flex items-center justify-center relative">
                {event.coverImage ? <img src={event.coverImage} className="w-full h-full object-cover" /> : <Calendar className="h-10 w-10 text-primary/40" />}
              </div>
              <div className="p-6">
                <h2 className="font-heading text-xl font-bold">{event.title}</h2>
                <p className="mt-1 text-sm font-medium text-primary">{event.collegeName}</p>
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3"><Calendar className="h-5 w-5 text-muted-foreground" /><p className="text-sm font-medium">{event.date} • {event.time}</p></div>
                  <div className="flex items-start gap-3"><MapPin className="h-5 w-5 text-muted-foreground" /><p className="text-sm font-medium">{event.venue || 'TBA'}</p></div>
                </div>
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-xl min-h-[500px] flex flex-col">
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full"></div>
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-primary transition-all duration-500`} style={{ width: `${(step - 1) * 50}%` }}></div>
                {[1, 2, 3].map(i => (
                  <div key={i} className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 font-bold transition-all ${step >= i ? 'bg-primary border-primary text-white scale-110 shadow-lg shadow-primary/20' : 'bg-card border-border text-muted-foreground'}`}>{i}</div>
                ))}
              </div>

              <div className="flex-1">
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="font-heading text-2xl font-bold">Personal Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Phone Number</label>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" placeholder="+91 XXX" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">College</label>
                        <input type="text" value={formData.college} onChange={e => setFormData({ ...formData, college: e.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Branch</label>
                        <input type="text" value={formData.branch} onChange={e => setFormData({ ...formData, branch: e.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Year of Study</label>
                        <select value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20">
                          <option value="">Select Year</option>
                          <option value="1st">1st Year</option>
                          <option value="2nd">2nd Year</option>
                          <option value="3rd">3rd Year</option>
                          <option value="4th">4th Year</option>
                        </select>
                      </div>
                    </div>

                    {isTeam && (
                      <div className="mt-8 pt-6 border-t border-border">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-heading text-lg font-bold flex items-center gap-2">
                            <Users className="h-5 w-5 text-primary" /> Team Squad
                          </h4>
                          <span className="text-xs font-bold px-2 py-1 bg-primary/10 text-primary rounded-lg">{formData.teamMembers.length} / {maxTeamMembers}</span>
                        </div>

                        {formData.teamMembers.length > 0 && (
                          <div className="space-y-2 mb-4">
                            {formData.teamMembers.map((m, i) => (
                              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border bg-muted/30">
                                <span className="text-sm font-medium">{m.name}</span>
                                <button onClick={() => setFormData(p => ({ ...p, teamMembers: p.teamMembers.filter((_, idx) => idx !== i) }))} className="text-destructive"><Trash2 className="h-4 w-4" /></button>
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="p-4 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="Member Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} className="rounded-lg border bg-background px-2 py-1.5 text-xs" />
                            <input type="email" placeholder="Member Email" value={newMember.email} onChange={e => setNewMember({ ...newMember, email: e.target.value })} className="rounded-lg border bg-background px-2 py-1.5 text-xs" />
                          </div>
                          <button onClick={handleAddMember} className="w-full py-2 bg-primary/10 text-primary text-xs font-black rounded-lg hover:bg-primary hover:text-white transition-all"><PlusCircle className="inline h-3 w-3 mr-1" /> Add Teammate</button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500 text-center py-12">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="h-10 w-10 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold">Verification Successful</h4>
                    <p className="text-muted-foreground max-w-xs mx-auto">Your details have been confirmed. Please proceed to final registration.</p>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-8 duration-500 py-12">
                    <CheckCircle className="mx-auto h-20 w-20 text-success mb-6" />
                    <h3 className="text-3xl font-black">{isPaid ? `Total: ₹${event.price}` : 'Free Registration'}</h3>
                    <p className="text-muted-foreground">Securing your spot for {event.title}...</p>
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} className="px-6 py-2 rounded-xl border border-border font-bold">Back</button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    disabled={!currentStepIsValid()}
                    className={`px-8 py-3 rounded-xl font-bold text-sm shadow-xl transition-all ${currentStepIsValid() ? 'bg-primary text-white hover:-translate-y-1' : 'bg-muted text-muted-foreground opacity-50 cursor-not-allowed'
                      }`}
                  >
                    Proceed to Next Step
                  </button>
                ) : (
                  <button
                    onClick={() => registerMutation.mutate()}
                    disabled={registerMutation.isPending}
                    className="px-10 py-3 rounded-xl bg-success text-white font-bold shadow-xl hover:-translate-y-1 transition-all"
                  >
                    {registerMutation.isPending ? 'Processing...' : 'Finalize Registration'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EventRegistrationPage;
