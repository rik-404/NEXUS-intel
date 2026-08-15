import React from 'react';
import { 
  LayoutDashboard, 
  Headphones, 
  BookOpen, 
  BarChart3, 
  Clock3, 
  Users, 
  AlertOctagon, 
  Settings, 
  BrainCircuit,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../../lib/types';

export type NavTab = 
  | 'dashboard'
  | 'occurrences'
  | 'knowledge-base'
  | 'reports'
  | 'shifts'
  | 'team'
  | 'incidents'
  | 'intelligence'
  | 'settings';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  userRole: UserRole;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab, userRole }) => {
  // Define module access per role
  const isAllowedTab = (tabId: string): boolean => {
    if (userRole === 'administrador') return true; // Admin has full access

    if (userRole === 'supervisor') {
      return ['dashboard', 'occurrences', 'knowledge-base', 'reports', 'shifts', 'team', 'intelligence', 'incidents', 'settings'].includes(tabId);
    }

    if (userRole === 'lider') {
      return ['dashboard', 'occurrences', 'knowledge-base', 'reports', 'shifts', 'team'].includes(tabId);
    }

    if (userRole === 'atendente') {
      return ['dashboard', 'occurrences', 'knowledge-base'].includes(tabId);
    }

    if (userRole === 'auditor') {
      return ['dashboard', 'occurrences', 'knowledge-base', 'reports', 'settings'].includes(tabId);
    }

    return true;
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'occurrences', label: 'Atendimento / Ocorrências', icon: Headphones },
    { id: 'knowledge-base', label: 'Base de Conhecimento', icon: BookOpen },
    { id: 'reports', label: 'Relatórios Automáticos', icon: BarChart3 },
    { id: 'shifts', label: 'Passagem de Turno', icon: Clock3 },
    { id: 'team', label: 'Equipe & Usuários', icon: Users },
    { id: 'intelligence', label: 'Inteligência & Tendências', icon: BrainCircuit },
    { id: 'incidents', label: 'Módulo de Incidentes', icon: AlertOctagon },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const visibleItems = menuItems.filter(item => isAllowedTab(item.id));

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      <div className="p-4">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Navegação ({userRole.toUpperCase()})
        </p>

        <nav className="space-y-1">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive 
                    ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30 shadow-sm shadow-indigo-500/10 font-semibold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {isActive && (
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info box */}
      <div className="mt-auto p-4 m-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[11px] font-medium text-slate-300">Acesso por Cargo Ativo</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
          Modo: <strong className="text-indigo-300 capitalize">{userRole}</strong>
        </p>
      </div>
    </aside>
  );
};
