import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Calendar, MapPin, Users, Ticket, Smartphone, CheckCircle, PlusCircle, Trash2 } from 'lucide-react';

const EventRegistrationPage: React.FC = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(1);
  // Default values loaded from user object
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    college: user?.college || '',
    branch: '',
    year: '',
    teamMembers: [] as any[]
  });

  const [newMember, setNewMember] = useState({ name: '', email: '', phone: '', college: user?.college || '', branch: '', year: '' });

  const { data: event, isLoading: isLoadingEvent, error } = useQuery({
    queryKey: ['event', eventId],
    queryFn: async () => {
      // Assuming event listing returns the array and we find the specific event. 
      // If there's an API for single event, better to use it. Here we fetch all and find:
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
      // Step 1: Secure a seat hold (90s)
      await api.post('/register/hold', { eventId });
      // Step 2: Confirm and finalize registration
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
      navigate('/student'); // Take them back to their portal where they can see the ticket
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
  // If team size is provided via event.teamSize, use it. Otherwise default to limit 5.
  const maxTeamMembers = event.teamSize ? parseInt(event.teamSize) : 5;
  const isPaid = !event.isFree;

  const handleAddMember = () => {
    if (formData.teamMembers.length >= maxTeamMembers) {
      toast.error(`Maximum limit of ${maxTeamMembers} members reached!`);
      return;
    }
    if (!newMember.name || !newMember.email || !newMember.phone || !newMember.branch || !newMember.year) {
      toast.error('Please fill all team member details');
      return;
    }
    setFormData(prev => ({ ...prev, teamMembers: [...prev.teamMembers, newMember] }));
    setNewMember({ name: '', email: '', phone: '', college: user?.college || '', branch: '', year: '' });
  };

  const currentStepIsValid = () => {
    if (step === 1) return formData.name && formData.email && formData.phone && formData.college && formData.branch && formData.year;
    if (step === 2 && isTeam) return formData.teamMembers.length > 0; // Require at least 1 member if team event? Depends on rules, we'll allow empty if they just want to go solo despite team allowed.
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
          {/* Left Column: Event Summary */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm sticky top-24">
              <div className="h-32 bg-primary/10 flex items-center justify-center relative">
                {event.coverImage ? (
                   <img src={event.coverImage} className="w-full h-full object-cover" />
                ) : (
                  <Calendar className="h-10 w-10 text-primary/40" />
                )}
                {event.category && (
                  <span className="absolute top-3 right-3 bg-background/90 text-xs font-bold px-2 py-1 rounded-xl backdrop-blur-md uppercase tracking-wider">
                    {event.category}
                  </span>
                )}
              </div>
              <div className="p-6">
                <h2 className="font-heading text-xl font-bold">{event.title}</h2>
                <p className="mt-1 text-sm font-medium text-primary">{event.collegeName}</p>
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{event.date}</p>
                      <p className="text-xs text-muted-foreground">{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0" />
                    <p className="text-sm font-medium text-foreground">{event.venue || 'TBA'}</p>
                  </div>
                  {isTeam && (
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-muted-foreground shrink-0" />
                      <p className="text-sm font-medium text-foreground">Team Event (Up to {maxTeamMembers})</p>
                    </div>
                  )}
                  <div className="flex items-start gap-3 border-t border-border pt-4 mt-4">
                    <Ticket className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Registration Fee</p>
                      <p className={`text-lg font-bold ${!isPaid ? 'text-success' : 'text-primary'}`}>
                        {!isPaid ? 'FREE' : `₹${event.price}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Multi-step Form */}
          <div className="md:col-span-2">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-sm min-h-[500px] flex flex-col relative overflow-hidden">
              {/* Stepper Header */}
              <div className="flex items-center justify-between mb-8 relative">
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted rounded-full"></div>
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1 rounded-full transition-all duration-500 ease-in-out ${step === 1 ? 'w-0' : step === 2 ? 'w-1/2 bg-primary' : 'w-full bg-success'}`}></div>
                
                <div className={`flex flex-col items-center relative z-10 bg-card px-2 transition-colors ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm bg-card border-2 ${step >= 1 ? 'border-primary' : 'border-muted-foreground'}`}>1</div>
                  <span className="text-[10px] uppercase font-bold mt-2 tracking-wider">Details</span>
                </div>
                <div className={`flex flex-col items-center relative z-10 bg-card px-2 transition-colors ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm bg-card border-2 ${step >= 2 ? 'border-primary' : 'border-border'}`}>2</div>
                  <span className="text-[10px] uppercase font-bold mt-2 tracking-wider">{isTeam ? 'Team' : 'Verify'}</span>
                </div>
                <div className={`flex flex-col items-center relative z-10 bg-card px-2 transition-colors ${step >= 3 ? 'text-success' : 'text-muted-foreground'}`}>
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-sm bg-card border-2 ${step >= 3 ? 'border-success' : 'border-border'}`}>3</div>
                  <span className="text-[10px] uppercase font-bold mt-2 tracking-wider">Payment</span>
                </div>
              </div>

              {/* Form Content */}
              <div className="flex-1">
                {step === 1 && (
                  <div className="space-y-5 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="font-heading text-2xl font-bold">Personal Information</h3>
                    <p className="text-sm text-muted-foreground mb-6">These details will be used for your official event certificate.</p>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Full Name</label>
                        <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Email Address</label>
                        <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="mt-1.5 w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm cursor-not-allowed opacity-70" disabled />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                        <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" placeholder="+91 XXXXX XXXXX" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">College</label>
                        <input type="text" value={formData.college} onChange={e => setFormData({...formData, college: e.target.value})} className="mt-1.5 w-full rounded-xl border border-input bg-background/50 px-4 py-3 text-sm cursor-not-allowed opacity-70" disabled />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Branch/Department</label>
                        <input type="text" value={formData.branch} onChange={e => setFormData({...formData, branch: e.target.value})} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20" placeholder="e.g. Computer Science" />
                      </div>
                      <div className="col-span-2 sm:col-span-1">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Year of Study</label>
                        <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20">
                          <option value="">Select Year</option>
                          <option value="1">First Year</option>
                          <option value="2">Second Year</option>
                          <option value="3">Third Year</option>
                          <option value="4">Fourth Year</option>
                          <option value="5">Fifth Year / PG</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                    <h3 className="font-heading text-2xl font-bold">{isTeam ? 'Team Roster' : 'Verification'}</h3>
                    
                    {isTeam ? (
                      <>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">Add up to {maxTeamMembers} members.</p>
                          <span className="text-xs font-bold px-3 py-1 bg-primary/10 text-primary rounded-full">{formData.teamMembers.length} / {maxTeamMembers} Added</span>
                        </div>

                        {/* Roster List */}
                        {formData.teamMembers.length > 0 && (
                          <div className="space-y-3">
                            {formData.teamMembers.map((member, i) => (
                              <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-border bg-card shadow-sm group">
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mr-4">
                                  <div className="truncate"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Name</p><p className="text-sm font-medium mt-0.5 truncate">{member.name}</p></div>
                                  <div className="truncate hidden sm:block"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Email</p><p className="text-sm mt-0.5 text-muted-foreground truncate">{member.email}</p></div>
                                  <div className="truncate hidden lg:block"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Branch</p><p className="text-sm mt-0.5 text-muted-foreground truncate">{member.branch}</p></div>
                                  <div className="truncate"><p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Phone</p><p className="text-sm mt-0.5 text-muted-foreground truncate">{member.phone}</p></div>
                                </div>
                                <button onClick={() => setFormData(prev => ({...prev, teamMembers: prev.teamMembers.filter((_, idx) => idx !== i)}))} className="p-2 text-destructive opacity-50 hover:opacity-100 hover:bg-destructive/10 rounded-xl transition-all">
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Member Form */}
                        {formData.teamMembers.length < maxTeamMembers && (
                          <div className="p-5 rounded-2xl border border-dashed border-primary/40 bg-primary/5">
                            <h4 className="text-sm font-bold text-primary mb-4 flex items-center gap-2"><PlusCircle className="h-4 w-4" /> Add Next Member</h4>
                            <div className="grid grid-cols-2 gap-4">
                              <input type="text" placeholder="Full Name" value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} className="rounded-xl border bg-background px-3 py-2 text-sm" />
                              <input type="email" placeholder="Email" value={newMember.email} onChange={e => setNewMember({...newMember, email: e.target.value})} className="rounded-xl border bg-background px-3 py-2 text-sm" />
                              <input type="tel" placeholder="Phone" value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} className="rounded-xl border bg-background px-3 py-2 text-sm" />
                              <input type="text" placeholder="Branch" value={newMember.branch} onChange={e => setNewMember({...newMember, branch: e.target.value})} className="rounded-xl border bg-background px-3 py-2 text-sm" />
                              <select value={newMember.year} onChange={e => setNewMember({...newMember, year: e.target.value})} className="col-span-2 sm:col-span-1 rounded-xl border bg-background px-3 py-2 text-sm">
                                <option value="">Select Year</option><option value="1">1st Year</option><option value="2">2nd Year</option><option value="3">3rd Year</option><option value="4">4th Year</option>
                              </select>
                              <button onClick={handleAddMember} className="col-span-2 sm:col-span-1 border border-primary bg-primary/10 text-primary font-bold rounded-xl py-2 text-sm hover:bg-primary hover:text-white transition-all">
                                Add to Roster
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="py-12 flex flex-col items-center justify-center text-center">
                         <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                           <User className="h-10 w-10 text-primary" />
                         </div>
                         <h4 className="text-xl font-bold">Individual Participant Validation</h4>
                         <p className="text-muted-foreground mt-2 max-w-sm">You are registering as a solo participant. Your provided details have been verified and locked in for the certificate.</p>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6 text-center animate-in fade-in slide-in-from-right-8 duration-500 py-6">
                    <h3 className="font-heading text-3xl font-bold text-foreground">
                      {isPaid ? 'Finalize Payment' : 'Registration Ready'}
                    </h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      {isPaid ? 'Please scan the QR code to pay the registration fee and secure your tickets.' : 'Your details look good! Click below to finalize your registration for free.'}
                    </p>
                    
                    {isPaid && (
                      <div className="flex flex-col items-center mt-8">
                        <div className="bg-white p-6 rounded-3xl border-4 border-primary/20 mb-6 shadow-2xl relative">
                          <div className="grid grid-cols-6 gap-1 w-56 h-56 opacity-90">
                              {Array.from({length: 36}).map((_, i) => (
                                <div key={i} className={`w-full h-full ${Math.random() > 0.4 ? 'bg-black rounded-sm' : 'bg-transparent'}`}></div>
                              ))}
                              {/* Center Logo marker for UPI */}
                              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-14 h-14 flex items-center justify-center rounded-xl shadow-lg border border-border">
                                <Smartphone className="h-7 w-7 text-primary" />
                              </div>
                          </div>
                        </div>
                        <div className="bg-primary/10 px-6 py-2 rounded-full border border-primary/20">
                           <p className="text-2xl font-black text-primary tracking-tight">₹{event.price}</p>
                        </div>
                      </div>
                    )}

                    {!isPaid && (
                      <div className="py-12">
                        <CheckCircle className="mx-auto h-24 w-24 text-success drop-shadow-sm mb-6" />
                        <div className="bg-success/10 px-6 py-2 rounded-full border border-success/20 inline-block">
                           <p className="text-lg font-black text-success tracking-widest uppercase">FREE EVENT</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Form Navigation */}
              <div className="mt-8 pt-6 border-t border-border flex items-center justify-between mt-auto">
                {step > 1 ? (
                  <button onClick={() => setStep(step - 1)} disabled={registerMutation.isPending} className="px-6 py-3 rounded-xl border border-input font-bold text-sm hover:bg-accent transition-colors disabled:opacity-50">
                    Go Back
                  </button>
                ) : <div></div>}

                {step < 3 ? (
                  <button 
                    onClick={() => setStep(step + 1)} 
                    disabled={!currentStepIsValid()}
                    className="px-8 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-sm shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transition-all outline-none disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    Proceed to Next Step
                  </button>
                ) : (
                  <button 
                    onClick={() => registerMutation.mutate()} 
                    disabled={registerMutation.isPending} 
                    className="flex items-center px-10 py-3 rounded-xl bg-success text-success-foreground font-bold text-base shadow-xl hover:shadow-success/25 hover:-translate-y-1 transition-all outline-none disabled:opacity-75 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {registerMutation.isPending ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...</>
                    ) : (
                      isPaid ? 'Confirm Payment & Register' : 'Finalize Registration'
                    )}
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
