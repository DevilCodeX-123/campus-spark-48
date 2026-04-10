import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { CheckCircle } from 'lucide-react';

const CollegeAdminSignup: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', password: '', collegeName: '', collegeCity: '',
    collegeWebsite: '', designation: '', idProofUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="font-heading text-2xl font-bold text-foreground">Request Submitted!</h2>
            <p className="mt-3 text-muted-foreground">
              Your college registration request has been sent to the platform owner for review.
              You'll receive an email once your request is approved.
            </p>
            <Link to="/" className="mt-6 inline-block rounded-lg bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground">
              Back to Home
            </Link>
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
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h1 className="font-heading text-2xl font-bold text-foreground">Register Your College</h1>
            <p className="mt-2 text-sm text-muted-foreground">Submit a request to add your college to CampusConnect</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Your Name</label>
                  <input type="text" value={form.name} onChange={e => update('name', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                  <input type="email" value={form.email} onChange={e => update('email', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
                <input type="password" value={form.password} onChange={e => update('password', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required minLength={6} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">College Name</label>
                  <input type="text" value={form.collegeName} onChange={e => update('collegeName', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-foreground">City</label>
                  <input type="text" value={form.collegeCity} onChange={e => update('collegeCity', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">College Website</label>
                <input type="url" value={form.collegeWebsite} onChange={e => update('collegeWebsite', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Your Designation</label>
                <input type="text" value={form.designation} onChange={e => update('designation', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required
                  placeholder="e.g., Dean of Students, Professor" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">College ID Proof URL</label>
                <input type="url" value={form.idProofUrl} onChange={e => update('idProofUrl', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required
                  placeholder="Link to your ID proof image" />
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90">
                Submit Registration Request
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already registered? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollegeAdminSignup;
