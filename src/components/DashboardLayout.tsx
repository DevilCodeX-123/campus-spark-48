import React from 'react';
import { ROLE_PANEL_CLASS, ROLE_PANEL_NAMES } from '@/types';
import type { UserRole } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
  tabs: { id: string; label: string; icon: React.ReactNode }[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, role, tabs, activeTab, onTabChange }) => {
  const { user } = useAuth();

  return (
    <div className={`min-h-screen bg-background ${ROLE_PANEL_CLASS[role]}`}>
      <div className="panel-header px-6 py-5">
        <div className="container mx-auto">
          <h1 className="font-heading text-2xl font-bold">{ROLE_PANEL_NAMES[role]}</h1>
          {user && <p className="mt-1 text-sm opacity-80">Welcome, {user.name}</p>}
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'panel-accent-btn'
                  : 'bg-card text-muted-foreground border border-border hover:bg-accent'
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
