import React from 'react';
import { ROLE_PANEL_CLASS, ROLE_PANEL_NAMES } from '@/types';
import type { UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  tabs: { id: string; label: string; icon: React.ReactNode }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, tabs, activeTab, onTabChange }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen bg-background flex flex-col ${ROLE_PANEL_CLASS[role]}`}>
      {/* Premium Glassmorphic Header */}
      <header className="relative z-20 border-b border-white/10 dark:border-white/5 bg-gradient-to-r from-primary/90 via-primary to-primary/80 dark:from-primary/20 dark:via-background dark:to-primary/10 shadow-xl backdrop-blur-xl">
        <div className="container mx-auto flex items-center justify-between px-6 py-4 relative">
          <div className="flex flex-col">
            <h1 className="font-heading text-2xl lg:text-3xl font-extrabold text-white dark:text-foreground tracking-tight drop-shadow-md">
              {ROLE_PANEL_NAMES[role]}
            </h1>
            {user && (
              <p className="mt-0.5 text-sm font-medium text-white/80 dark:text-muted-foreground flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Welcome back, {user.name}
              </p>
            )}
          </div>

          {/* Right Controls: Theme Toggle + Profile Dropdown */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle — neatly encapsulated in a pill */}
            <div className="rounded-full bg-white/10 dark:bg-white/5 p-1 border border-white/20 dark:border-white/10 shadow-inner">
              <ThemeToggle />
            </div>

            {/* Profile Avatar Dropdown */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none outline-none ring-0">
                  <div className="group relative flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/40 dark:border-white/10 bg-gradient-to-br from-white/25 to-white/5 dark:from-white/10 dark:to-transparent text-lg font-black uppercase text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-white/70 cursor-pointer">
                    {user.name.charAt(0)}
                    {/* Online indicator dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-60 animate-ping"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 border-2 border-background"></span>
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 mt-3 rounded-2xl shadow-2xl border border-border/50 bg-background/95 backdrop-blur-xl p-2 animate-in fade-in slide-in-from-top-4 duration-300">
                  <DropdownMenuLabel className="font-normal px-3 py-3 mb-1 bg-gradient-to-br from-muted/60 to-muted/20 rounded-xl border border-border/30">
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {user.college && (
                        <p className="text-[10px] uppercase tracking-widest text-primary mt-1 font-extrabold flex items-center gap-1">
                          <User className="h-3 w-3 shrink-0" />
                          <span className="truncate">{user.college}</span>
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="opacity-40" />
                  <DropdownMenuItem
                    className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive rounded-xl px-3 py-2.5 mt-1 transition-colors"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span className="font-bold">Secure Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.id
                  ? 'panel-accent-btn shadow-md'
                  : 'bg-card text-muted-foreground border border-border hover:bg-accent hover:text-foreground'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <div className="animate-fade-in">
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
