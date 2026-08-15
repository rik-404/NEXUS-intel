import React from 'react';
import { Header } from './Header';
import { Sidebar, NavTab } from './Sidebar';
import { UserProfile, UserRole } from '../../lib/types';
import { DataService } from '../../lib/supabase';

interface AppLayoutProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  onUserRoleChange: (newRole: UserRole) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  currentTab, 
  onSelectTab, 
  currentUser,
  onUserRoleChange,
  onLogout,
  children 
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header currentUser={currentUser} onUserRoleChange={onUserRoleChange} onLogout={onLogout} />
      <div className="flex flex-1">
        <Sidebar currentTab={currentTab} onSelectTab={onSelectTab} userRole={currentUser.role} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};
