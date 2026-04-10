import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLE_PANEL_NAMES, ROLE_ROUTES } from '@/types';
import { LogOut, Menu, X, User } from 'lucide-react';
import { useState } from 'react';

import { ThemeToggle } from './ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary font-heading text-sm font-bold text-primary-foreground shadow-sm">
            CC
          </div>
          <span className="font-heading text-lg font-bold text-foreground tracking-tight">CampusConnect</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-5 md:flex">
          {!isAuthenticated || !user ? (
            <>
              <Link to="/login" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Login
              </Link>
              <Link to="/signup" className="panel-accent-btn panel-student text-sm px-4 py-1.5 shadow-sm">
                Sign Up
              </Link>
              <ThemeToggle />
            </>
          ) : (
            <>
              <div className="flex items-center gap-4 border-r border-border pr-5">
                <Link
                  to={ROLE_ROUTES[user.role as keyof typeof ROLE_ROUTES] || '/'}
                  className="text-sm font-bold text-primary transition-colors hover:text-foreground"
                >
                  {ROLE_PANEL_NAMES[user.role as keyof typeof ROLE_PANEL_NAMES] || 'Dashboard'}
                </Link>
              </div>
              
              <div className="flex items-center gap-3">
                <ThemeToggle />
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-lg font-bold uppercase text-primary shadow-sm hover:ring-2 hover:ring-primary/40 transition-all cursor-pointer">
                      {user.name.charAt(0)}
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl shadow-xl">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() => navigate(ROLE_ROUTES[user.role as keyof typeof ROLE_ROUTES] || '/')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      <span>{ROLE_PANEL_NAMES[user.role as keyof typeof ROLE_PANEL_NAMES] || 'Dashboard'}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1">
            {mobileOpen ? <X className="h-6 w-6 text-foreground" /> : <Menu className="h-6 w-6 text-foreground" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
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
