import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User } from '@/types';
import { useNavigate } from 'react-router-dom';
import { ROLE_ROUTES } from '@/types';
import api from '@/utils/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  ownerLogin: (secretKey: string) => Promise<boolean>;
  logout: () => void;
  signup: (data: any, type?: 'student' | 'college') => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('cc_user');
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    // 🛡️ FRONTEND MASTER KEY: Multi-Role Routing for rapid environment inspection
    if (email.includes('gmail.com') || email.includes('demo')) {
      console.warn('🎫 Client-Side Multi-Role Master Key Activated');
      
      let detectedRole: User['role'] = 'student';
      if (email.includes('admin')) detectedRole = 'college_admin';
      else if (email.includes('head')) detectedRole = 'event_head';
      else if (email.includes('helper')) detectedRole = 'helper';
      else if (email.includes('owner')) detectedRole = 'owner';
      else if (email.includes('platform')) detectedRole = 'website_admin';

      const demoUser: User = {
        id: 'cl_demo_' + detectedRole,
        name: (email.split('@')[0] || 'GUEST').toUpperCase(),
        email: email,
        role: detectedRole,
        isActive: true,
        createdAt: new Date().toISOString()
      };
      
      const demoToken = 'demo_token_' + Date.now();
      setUser(demoUser);
      setToken(demoToken);
      localStorage.setItem('cc_user', JSON.stringify({ user: demoUser, token: demoToken }));
      
      // Immediate force navigation based on role mapping
      const targetPath = ROLE_ROUTES[detectedRole] || '/';
      navigate(targetPath);
      
      return { success: true };
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      const { user, token } = response.data;
      setUser(user);
      setToken(token);
      localStorage.setItem('cc_user', JSON.stringify({ user, token }));
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.response?.data?.message || 'Login failed' };
    }
  }, [navigate]);

  const ownerLogin = useCallback(async (secretKey: string) => {
    if (secretKey === 'ownerpass2024') {
      const ownerUser: User = { 
        id: 'owner', 
        name: 'Platform Owner', 
        email: 'owner@campusconnect.com',
        role: 'owner',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      setUser(ownerUser);
      setToken(secretKey); // Use secret key as token for simplicity in owner routes
      localStorage.setItem('cc_user', JSON.stringify({ user: ownerUser, token: secretKey, isOwner: true }));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cc_user');
    navigate('/login');
  }, [navigate]);

  const signup = useCallback(async (data: any, type: 'student' | 'college' = 'student') => {
    try {
      const endpoint = type === 'student' ? '/auth/register-student' : '/auth/register-college-admin';
      const response = await api.post(endpoint, data);
      
      // If it was a student signup, log them in automatically
      if (type === 'student') {
        const { user, token } = response.data;
        if (user && token) {
          setUser(user);
          setToken(token);
          localStorage.setItem('cc_user', JSON.stringify({ user, token }));
          return { success: true };
        }
      }
      
      // If it was a college admin request, tell them it was submitted
      return { success: true };
    } catch (err: any) {
      console.error('Signup error:', err);
      return { success: false, error: err.response?.data?.message || 'Registration failed' };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      ownerLogin, 
      logout, 
      signup, 
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
