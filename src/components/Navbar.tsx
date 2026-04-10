import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLE_PANEL_NAMES, ROLE_ROUTES } from '@/types';
import { LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground">
            CC
          </div>
          <span className="font-heading text-lg font-bold text-foreground">CampusConnect</span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <Link to="/events" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Events
          </Link>
          {!isAuthenticated || !user ? (
            <>
              <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Login
              </Link>
              <Link to="/signup" className="panel-accent-btn panel-student text-sm">
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to={ROLE_ROUTES[user.role as keyof typeof ROLE_ROUTES] || '/'}
                className="text-sm font-medium text-foreground"
              >
                {ROLE_PANEL_NAMES[user.role as keyof typeof ROLE_PANEL_NAMES] || 'Dashboard'}
              </Link>
              <span className="text-sm text-muted-foreground">{user.name}</span>
              <button onClick={handleLogout} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive">
                <LogOut className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link to="/events" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">Events</Link>
            {!isAuthenticated || !user ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="text-sm text-muted-foreground">Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="text-sm text-primary font-medium">Sign Up</Link>
              </>
            ) : (
              <>
                <Link to={ROLE_ROUTES[user.role as keyof typeof ROLE_ROUTES] || '/'} onClick={() => setMobileOpen(false)} className="text-sm font-medium">{ROLE_PANEL_NAMES[user.role as keyof typeof ROLE_PANEL_NAMES] || 'Dashboard'}</Link>
                <button onClick={() => { handleLogout(); setMobileOpen(false); }} className="text-sm text-destructive text-left">Logout</button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
