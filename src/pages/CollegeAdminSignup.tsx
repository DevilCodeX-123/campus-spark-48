import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

const CollegeAdminSignup: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', collegeName: '', collegeCity: '',
    collegeWebsite: '', designation: '', idProofUrl: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      const result = await signup(form, 'college');
      if (result.success) {
        setSubmitted(true);
        toast.success('Registration request submitted!');
      } else {
        toast.error(result.error);
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="max-w-md text-center p-8 rounded-3xl border border-border bg-card shadow-2xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 animate-bounce">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-foreground">Request Sent!</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              We've received your registration request for <strong>{form.collegeName}</strong>. 
              Our platform administrators will review your details shortly.
            </p>
            <div className="mt-8">
              <Link to="/" className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-3 font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-all">
                <ArrowLeft className="h-4 w-4" /> Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          <div className="rounded-3xl border border-border bg-card p-10 shadow-xl">
            <h1 className="font-heading text-3xl font-bold text-foreground">Register College</h1>
            <p className="mt-2 text-muted-foreground">Admin/Owner approval is required for new colleges.</p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Your Name</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required placeholder="Full Name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required placeholder="name@college.edu" />
                </div>
              </div>
              
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Password</label>
                  <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required minLength={6} placeholder="Min. 6 characters" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Confirm Password</label>
                  <input type="password" value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required minLength={6} placeholder="Min. 6 characters" />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">College Name</label>
                  <input type="text" value={form.collegeName} onChange={e => update('collegeName', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required placeholder="University Name" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">City</label>
                  <input type="text" value={form.collegeCity} onChange={e => update('collegeCity', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required placeholder="Location" />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-foreground">College Website</label>
                <input type="url" value={form.collegeWebsite} onChange={e => update('collegeWebsite', e.target.value)}
                  className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required placeholder="https://www.college.edu" />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">Your Designation</label>
                  <input type="text" value={form.designation} onChange={e => update('designation', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required
                    placeholder="e.g. Dean, HOD" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-foreground">ID Proof URL</label>
                  <input type="url" value={form.idProofUrl} onChange={e => update('idProofUrl', e.target.value)}
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" required
                    placeholder="Link to ID scan" />
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 font-bold text-primary-foreground shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Submit Registration Request'}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground font-medium">
              Already registered? <Link to="/login" className="text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeAdminSignup;
