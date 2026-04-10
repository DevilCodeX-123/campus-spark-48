import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLE_ROUTES } from '@/types';
import Navbar from '@/components/Navbar';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = login(email, password);
    if (result.success) {
      const user = JSON.parse(localStorage.getItem('cc_user')!);
      navigate(ROLE_ROUTES[user.role as keyof typeof ROLE_ROUTES]);
    } else {
      setError(result.error || 'Login failed');
    }
  };

  const demoAccounts = [
    { email: 'sarah@campusconnect.com', role: 'Website Admin' },
    { email: 'rajesh@iitd.ac.in', role: 'College Admin' },
    { email: 'arjun@iitd.ac.in', role: 'Event Head' },
    { email: 'rahul@iitd.ac.in', role: 'Helper' },
    { email: 'ananya@iitd.ac.in', role: 'Student' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h1 className="font-heading text-2xl font-bold text-foreground">Welcome Back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in to your CampusConnect account</p>

            {error && (
              <div className="mt-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@college.edu"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Password</label>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-2.5 text-muted-foreground">
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90">
                Sign In
              </button>
            </form>

            <div className="mt-6 border-t border-border pt-4">
              <p className="mb-3 text-xs font-medium text-muted-foreground">Quick Demo Login (click to fill)</p>
              <div className="flex flex-wrap gap-2">
                {demoAccounts.map(d => (
                  <button
                    key={d.email}
                    onClick={() => { setEmail(d.email); setPassword('demo'); }}
                    className="rounded-md bg-muted px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                  >
                    {d.role}
                  </button>
                ))}
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/signup" className="font-medium text-primary hover:underline">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
