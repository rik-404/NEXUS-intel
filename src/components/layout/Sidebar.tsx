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
  ChevronRight,
  Lock
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
  const isSupervisorOrAbove = ['lider', 'supervisor', 'administrador'].includes(userRole);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, phase: 'Fase 1' },
    { id: 'occurrences', label: 'Atendimento / Ocorrências', icon: Headphones, phase: 'Fase 1' },
    { id: 'knowledge-base', label: 'Base de Conhecimento', icon: BookOpen, phase: 'Fase 1' },
    { id: 'reports', label: 'Relatórios Automáticos', icon: BarChart3, phase: 'Fase 2' },
    { id: 'shifts', label: 'Passagem de Turno', icon: Clock3, phase: 'Fase 2' },
    { 
      id: 'team', 
      label: 'Equipe & Desempenho', 
      icon: Users, 
      phase: 'Fase 2', 
      restricted: true,
      hidden: !isSupervisorOrAbove 
    },
    { id: 'intelligence', label: 'Inteligência & Tendências', icon: BrainCircuit, phase: 'Fase 3' },
    { id: 'incidents', label: 'Módulo de Incidentes', icon: AlertOctagon, phase: 'Fase 3' },
    { id: 'settings', label: 'Configurações', icon: Settings, phase: 'Fase 1' },
  ];

  return (
    <aside className="w-64 bg-slate-900/60 border-r border-slate-800 flex flex-col h-[calc(100vh-4rem)] sticky top-16 select-none shrink-0">
      <div className="p-4">
        <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Navegação Principal
        </p>

        <nav className="space-y-1">
          {menuItems.filter(item => !item.hidden).map((item) => {
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

                <div className="flex items-center space-x-1.5">
                  {item.restricted && (
                    <span title="Acesso Restrito a Líderes/Supervisores">
                      <Lock className="w-3 h-3 text-amber-400" />
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer info box */}
      <div className="mt-auto p-4 m-3 rounded-xl bg-slate-800/40 border border-slate-700/50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-[11px] font-medium text-slate-300">Base Supabase Pronta</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">
          RLS e mascaramento LGPD ativados.
        </p>
      </div>
    </aside>
  );
};
