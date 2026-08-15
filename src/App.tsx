import React, { useState } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import { NavTab } from './components/layout/Sidebar';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { OccurrencesPage } from './pages/OccurrencesPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { ReportsPage } from './pages/ReportsPage';
import { ShiftsPage } from './pages/ShiftsPage';
import { TeamPage } from './pages/TeamPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { IntelligencePage } from './pages/IntelligencePage';
import { SettingsPage } from './pages/SettingsPage';
import { KBArticle, UserProfile } from './lib/types';
import { DataService } from './lib/supabase';

export function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => DataService.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedArticleForReading, setSelectedArticleForReading] = useState<KBArticle | null>(null);

  const handleLogout = () => {
    DataService.logoutUser();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <LoginPage onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigateToOccurrences={() => setCurrentTab('occurrences')}
            onNavigateToKB={() => setCurrentTab('knowledge-base')}
            onReadArticle={(art) => setSelectedArticleForReading(art)}
          />
        );
      case 'occurrences':
        return <OccurrencesPage />;
      case 'knowledge-base':
        return (
          <KnowledgeBasePage
            selectedArticleForReading={selectedArticleForReading}
            onClearSelectedArticle={() => setSelectedArticleForReading(null)}
          />
        );
      case 'reports':
        return <ReportsPage />;
      case 'shifts':
        return <ShiftsPage />;
      case 'team':
        return <TeamPage userRole={currentUser.role} />;
      case 'incidents':
        return <IncidentsPage />;
      case 'intelligence':
        return <IntelligencePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return (
          <DashboardPage
            onNavigateToOccurrences={() => setCurrentTab('occurrences')}
            onNavigateToKB={() => setCurrentTab('knowledge-base')}
            onReadArticle={(art) => setSelectedArticleForReading(art)}
          />
        );
    }
  };

  return (
    <AppLayout 
      currentTab={currentTab} 
      onSelectTab={setCurrentTab}
      currentUser={currentUser}
      onLogout={handleLogout}
    >
      {renderContent()}
    </AppLayout>
  );
}

export default App;
