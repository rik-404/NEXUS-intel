import React, { useState } from 'react';
import { UserProfile, UserRole } from '../../lib/types';
import { Sparkles, Bell, LogOut, CheckCircle2, AlertTriangle } from 'lucide-react';

interface HeaderProps {
  currentUser: UserProfile;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentUser, onLogout }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const roleLabels: Record<UserRole, { label: string; color: string }> = {
    atendente: { label: 'Atendente', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    lider: { label: 'Líder de Equipe', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    supervisor: { label: 'Supervisor', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    administrador: { label: 'Administrador (Dev)', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    auditor: { label: 'Auditor LGPD', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  };

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    onLogout();
  };

  return (
    <>
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
        {/* Brand logo */}
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

        {/* Right controls: Active Session, Notifications, User Badge & Logout */}
        <div className="flex items-center space-x-4">
          {/* Active Session Status Badge */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Sessão Autenticada</span>
          </div>

          {/* Notification Bell */}
          <button className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-slate-900"></span>
          </button>

          {/* User Badge & Registered Role (No selector, strictly registered role) */}
          <div className="flex items-center space-x-3 pl-2 border-l border-slate-800">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 font-semibold text-xs border border-slate-600">
              {currentUser.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-none">{currentUser.fullName}</p>
              <span className={`inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded border ${roleLabels[currentUser.role]?.color || 'bg-slate-800 text-slate-300 border-slate-700'} font-medium`}>
                {roleLabels[currentUser.role]?.label || currentUser.role}
              </span>
            </div>

            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Confirmation Modal for Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-sm rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Encerrar Sessão?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Você sairá da sua conta de <strong>{currentUser.fullName}</strong> ({currentUser.email}).
              </p>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-500/25 transition-all"
              >
                Sim, Sair Agora
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
