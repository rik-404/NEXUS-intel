import React from 'react';
import { UserProfile, UserRole } from '../../lib/types';
import { DataService } from '../../lib/supabase';
import { Shield, Clock, Bell, Sparkles, LogOut } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onUserRoleChange: (newRole: UserRole) => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onUserRoleChange, onLogout }) => {
  const activeShift = DataService.getActiveShift();

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    atendente: { label: 'Atendente', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    lider: { label: 'Líder de Equipe', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    supervisor: { label: 'Supervisor', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    administrador: { label: 'Administrador', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    auditor: { label: 'Auditor LGPD', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Brand logo & Shift info */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
              NEXUS <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-medium">INTEL</span>
            </span>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Centro de Inteligência</p>
          </div>
        </div>

        {/* Turno Ativo Indicator */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs text-slate-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Clock className="w-3.5 h-3.5 text-slate-400 ml-1" />
          <span className="font-medium">{activeShift ? activeShift.title : 'Sem turno ativo'}</span>
        </div>
      </div>

      {/* Right controls: RBAC Role Simulator & User Profile & Logout */}
      <div className="flex items-center space-x-4">
        {/* Simulator Selector for RBAC Demo */}
        <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700 rounded-lg p-1 text-xs">
          <Shield className="w-3.5 h-3.5 text-indigo-400 ml-1.5" />
          <span className="text-slate-400 hidden sm:inline text-[11px] font-medium">Papel:</span>
          <select 
            value={currentUser.role}
            onChange={(e) => onUserRoleChange(e.target.value as UserRole)}
            className="bg-slate-900 text-slate-200 border-none text-xs rounded px-2 py-1 font-medium focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            title="Alternar Papel RBAC para demonstração"
          >
            <option value="atendente">Atendente</option>
            <option value="lider">Líder de Equipe</option>
            <option value="supervisor">Supervisor</option>
            <option value="administrador">Administrador</option>
            <option value="auditor">Auditor LGPD</option>
          </select>
        </div>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900"></span>
        </button>

        {/* User Badge & Logout Button */}
        <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs border border-slate-600">
            {currentUser.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-200 leading-none">{currentUser.fullName}</p>
            <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded border ${roleLabels[currentUser.role].color} font-medium`}>
              {roleLabels[currentUser.role].label}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            title="Sair da plataforma"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
