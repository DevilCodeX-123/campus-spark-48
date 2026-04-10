import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types';
import { mockUsers, mockColleges } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { ROLE_ROUTES } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  ownerLogin: (secretKey: string) => boolean;
  logout: () => void;
  signup: (data: { name: string; email: string; password: string; collegeId: string }) => { success: boolean; error?: string };
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('cc_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback((email: string, _password: string) => {
    const found = mockUsers.find(u => u.email === email && u.isActive);
    if (!found) return { success: false, error: 'Invalid credentials or account inactive' };
    if (found.role === 'owner') return { success: false, error: 'Invalid credentials' };
    setUser(found);
    localStorage.setItem('cc_user', JSON.stringify(found));
    return { success: true };
  }, []);

  const ownerLogin = useCallback((secretKey: string) => {
    if (secretKey === 'ownerpass2024') {
      const owner = mockUsers.find(u => u.role === 'owner')!;
      setUser(owner);
      localStorage.setItem('cc_user', JSON.stringify(owner));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('cc_user');
  }, []);

  const signup = useCallback((data: { name: string; email: string; password: string; collegeId: string }) => {
    if (mockUsers.find(u => u.email === data.email)) {
      return { success: false, error: 'Email already registered' };
    }
    const college = mockColleges.find(c => c.id === data.collegeId);
    const newUser: User = {
      id: `u${Date.now()}`,
      name: data.name,
      email: data.email,
      role: 'student',
      collegeId: data.collegeId,
      college: college?.name || '',
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    localStorage.setItem('cc_user', JSON.stringify(newUser));
    return { success: true };
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, ownerLogin, logout, signup, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
