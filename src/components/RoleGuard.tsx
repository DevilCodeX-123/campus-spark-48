import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import type { UserRole } from '@/types';

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

const ROLE_ROUTES: Record<string, string> = {
  owner: '/owner-access-9x72k',
  website_admin: '/admin',
  college_admin: '/college-admin',
  event_head: '/event-head',
  helper: '/helper',
  student: '/student',
};

const RoleGuard: React.FC<RoleGuardProps> = ({ allowedRoles, children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // CRITICAL: Wait for localStorage to hydrate before making routing decisions.
  // Without this, RoleGuard redirects to /login BEFORE the stored session is loaded,
  // clearing auth state and causing a permanent blank screen loop.
  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0f172a' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '4px solid #334155', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: '#64748b', marginTop: 16, fontSize: 14 }}>Loading session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const target = ROLE_ROUTES[user.role] || '/login';
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};

export default RoleGuard;
