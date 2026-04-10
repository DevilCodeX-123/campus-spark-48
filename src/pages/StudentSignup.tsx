import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import { toast } from 'sonner';
import { User, Mail, Lock, Building, ArrowRight, Loader2, Info, AlertCircle } from 'lucide-react';
import api from '@/utils/api';

const StudentSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    collegeId: '',
    collegeName: '',
  });
  const [colleges, setColleges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingColleges, setIsFetchingColleges] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchColleges = async () => {
      setFetchError(false);
      try {
        const response = await api.get('/auth/colleges');
        // Standardize data to array
        const data = Array.isArray(response.data) ? response.data : [];
        setColleges(data);
      } catch (err) {
        console.error('Failed to load colleges:', err);
        setFetchError(true);
        toast.error('Could not connect to database for college list');
      } finally {
        setIsFetchingColleges(false);
      }
    };
    fetchColleges();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.collegeId) {
      toast.error('Please select your college');
      return;
    }
    
    setIsLoading(true);
    try {
      // Unified call via AuthContext
      const result = await signup(formData, 'student');
      
      if (result.success) {
        toast.success('Registration successful! Welcome to CampusConnect.');
        navigate('/student');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (err: any) {
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cid = e.target.value;
    const selected = colleges.find(c => c._id === cid || c.id === cid);
    setFormData({
      ...formData, 
      collegeId: cid, 
      collegeName: selected?.name || ''
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card p-8 shadow-lg">
            <h1 className="font-heading text-2xl font-bold text-foreground">Create Account</h1>
            <p className="mt-2 text-sm text-muted-foreground">Join CampusConnect as a student</p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <Label className="mb-1 block">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="John Doe"
                    className="pl-10"
                    required 
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="email" 
                    value={formData.email} 
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="john@example.edu"
                    className="pl-10"
                    required 
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1 block">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    placeholder="••••••••"
                    className="pl-10"
                    required 
                    minLength={6} 
                  />
                </div>
              </div>
              <div>
                <Label className="mb-1 block">College</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <select 
                    value={formData.collegeId} 
                    onChange={handleCollegeChange}
                    className="w-full rounded-md border border-input bg-background pl-10 pr-4 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                    required
                    disabled={isFetchingColleges || fetchError}
                  >
                    {isFetchingColleges ? (
                      <option>Loading colleges...</option>
                    ) : fetchError ? (
                      <option>Database Connection Failed</option>
                    ) : (
                      <>
                        <option value="">Select your college</option>
                        {colleges.map((c: any) => (
                          <option key={c._id || c.id} value={c._id || c.id}>
                            {c.name}
                          </option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
                {fetchError ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive">
                    <AlertCircle className="h-3 w-3" />
                    Database connection error. Please try later.
                  </p>
                ) : formData.collegeId === '' && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Info className="h-3 w-3" />
                    College not listed? <Link to="/register-college" className="text-primary hover:underline font-medium">Verify your college</Link>
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || fetchError}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="font-medium text-primary hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentSignup;
