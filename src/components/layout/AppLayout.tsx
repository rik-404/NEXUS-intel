import React from 'react';
import { Header } from './Header';
import { Sidebar, NavTab } from './Sidebar';
import { UserProfile } from '../../lib/types';

interface AppLayoutProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentUser: UserProfile;
  onLogout: () => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ 
  currentTab, 
  onSelectTab, 
  currentUser,
  onLogout,
  children 
}) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header currentUser={currentUser} onLogout={onLogout} />
      <div className="flex flex-1">
        <Sidebar currentTab={currentTab} onSelectTab={onSelectTab} userRole={currentUser.role} />
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto max-w-7xl">
          {children}
        </main>
      </div>
    </div>
  );
};
