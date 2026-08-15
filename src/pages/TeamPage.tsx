import React, { useState } from 'react';
import { 
  Users, 
  Lock, 
  ShieldAlert, 
  Award, 
  UserPlus, 
  CheckCircle2, 
  X, 
  UserCheck, 
  UserX, 
  Edit2, 
  Shield, 
  Search,
  Key
} from 'lucide-react';
import { DataService } from '../lib/supabase';
import { UserRole, UserProfile } from '../lib/types';

interface TeamPageProps {
  userRole: UserRole;
}

export const TeamPage: React.FC<TeamPageProps> = ({ userRole }) => {
  const isAuthorized = ['lider', 'supervisor', 'administrador'].includes(userRole);
  const [profiles, setProfiles] = useState<UserProfile[]>(() => DataService.getAllProfiles());
  const occurrences = DataService.getOccurrences();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Internal User Creation Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newRole, setNewRole] = useState<UserRole>('atendente');
  const [newTeam, setNewTeam] = useState('Nível 1 - Geral');
  const [notification, setNotification] = useState<string | null>(null);

  // Determine allowed roles to assign based on current logged user's authority hierarchy
  const getAllowedRolesToAssign = (creatorRole: UserRole): { role: UserRole; label: string }[] => {
    const allRoles: { role: UserRole; label: string }[] = [
      { role: 'administrador', label: 'Administrador (Dev)' },
      { role: 'supervisor', label: 'Supervisor' },
      { role: 'lider', label: 'Líder de Equipe' },
      { role: 'atendente', label: 'Atendente' },
      { role: 'auditor', label: 'Auditor LGPD' },
    ];

    if (creatorRole === 'administrador') {
      return allRoles;
    }
    if (creatorRole === 'supervisor') {
      return allRoles.filter(r => ['lider', 'atendente', 'auditor'].includes(r.role));
    }
    if (creatorRole === 'lider') {
      return allRoles.filter(r => r.role === 'atendente');
    }
    return [];
  };

  const allowedRoles = getAllowedRolesToAssign(userRole);

  if (!isAuthorized) {
    return (
      <div className="glass-panel rounded-2xl border border-rose-500/30 bg-rose-950/20 p-12 text-center space-y-4 max-w-xl mx-auto my-12">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto text-rose-400">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Acesso Restrito — Governança RBAC</h2>
        <p className="text-xs text-slate-300 leading-relaxed">
          O gerenciamento interno de usuários e as métricas da equipe são **visíveis apenas para Líderes, Supervisores e Administradores**.
        </p>
      </div>
    );
  }

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setNewFullName('');
    setNewEmail('');
    setNewPassword('');
    setNewRole(allowedRoles[0]?.role || 'atendente');
    setNewTeam('Nível 1 - Geral');
    setShowCreateModal(true);
  };

  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setNewFullName(user.fullName);
    setNewEmail(user.email);
    setNewPassword('');
    setNewRole(user.role);
    setNewTeam(user.teamName);
    setShowCreateModal(true);
  };

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName.trim() || !newEmail.trim()) return;

    if (editingUser) {
      // Update existing user
      DataService.updateUser(editingUser.id, {
        fullName: newFullName.trim(),
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        teamName: newTeam
      });
      setNotification(`Usuário ${newFullName} e credenciais atualizados com sucesso!`);
    } else {
      if (!newPassword.trim()) {
        alert('Por favor, defina uma senha inicial para o novo colaborador.');
        return;
      }

      // Create new user
      const createdUser = DataService.registerUser({
        fullName: newFullName.trim(),
        email: newEmail.trim().toLowerCase(),
        role: newRole,
        teamName: newTeam
      });
      setNotification(`Usuário ${createdUser.fullName} (${createdUser.role}) cadastrado com sucesso!`);
    }

    setProfiles(DataService.getAllProfiles());
    setShowCreateModal(false);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleActive = (user: UserProfile) => {
    DataService.toggleUserActive(user.id);
    setProfiles(DataService.getAllProfiles());
    setNotification(`Status do usuário ${user.fullName} alterado para ${user.isActive ? 'Inativo' : 'Ativo'}.`);
    setTimeout(() => setNotification(null), 4000);
  };

  // Filter profiles
  const filteredProfiles = profiles.filter((p) => {
    const matchesSearch = 
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.teamName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || p.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Gerenciamento Interno de Usuários & Equipe
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastro de novos colaboradores com definição de senha e controle hierárquico de papéis RBAC.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2 shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Novo Usuário</span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Role Authority Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-200">
        <div className="flex items-center space-x-3">
          <Shield className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <p className="font-semibold">Nível de Permissão Atual: <strong className="text-white uppercase font-mono">{userRole}</strong></p>
            <p className="text-[11px] text-indigo-300/80 mt-0.5">
              {userRole === 'administrador' && 'Como Administrador/Dev, você pode cadastrar e definir senha para TODOS os cargos.'}
              {userRole === 'supervisor' && 'Como Supervisor, você pode cadastrar usuários e senhas para cargos abaixo do seu (Líder, Atendente e Auditor).'}
              {userRole === 'lider' && 'Como Líder de Equipe, você pode cadastrar atendentes e definir suas senhas iniciais.'}
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right font-mono text-[10px] text-indigo-300">
          Cargos permitidos: {allowedRoles.map(r => r.role).join(', ')}
        </div>
      </div>

      {/* Table & Filters */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            Lista de Usuários Internos ({filteredProfiles.length})
          </h3>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar por nome, e-mail..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-200"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200"
            >
              <option value="ALL">Todos os Cargos</option>
              <option value="administrador">Administrador</option>
              <option value="supervisor">Supervisor</option>
              <option value="lider">Líder de Equipe</option>
              <option value="atendente">Atendente</option>
              <option value="auditor">Auditor LGPD</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4">Usuário</th>
                <th className="py-3 px-4">E-mail Corporativo</th>
                <th className="py-3 px-4">Papel (RBAC)</th>
                <th className="py-3 px-4">Equipe</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredProfiles.map((user) => {
                const canEditThisUser = 
                  userRole === 'administrador' ||
                  (userRole === 'supervisor' && ['lider', 'atendente', 'auditor'].includes(user.role)) ||
                  (userRole === 'lider' && user.role === 'atendente');

                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-200 flex items-center space-x-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs text-slate-200 border border-slate-600">
                        {user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <span className="block font-bold">{user.fullName}</span>
                        <span className="text-[10px] text-slate-500 font-mono">ID: {user.id}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                      {user.email}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        user.role === 'administrador' ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' :
                        user.role === 'supervisor' ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30' :
                        user.role === 'lider' ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' :
                        'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-300">
                      {user.teamName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${
                        user.isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {user.isActive ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canEditThisUser ? (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEditModal(user)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-400 text-slate-400 transition-colors"
                            title="Editar usuário e senha"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleToggleActive(user)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.isActive 
                                ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400' 
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                            }`}
                            title={user.isActive ? 'Desativar usuário' : 'Ativar usuário'}
                          >
                            {user.isActive ? <UserX className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Sem permissão</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating / Editing User with Password */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-400" />
                {editingUser ? 'Editar Usuário e Senha' : 'Cadastrar Novo Usuário e Definir Senha'}
              </h3>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs text-slate-300">
              <div>
                <label className="block font-semibold mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Nome do colaborador"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">E-mail Corporativo *</label>
                <input
                  type="email"
                  required
                  placeholder="colaborador@empresa.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 flex items-center justify-between">
                  <span>Senha de Acesso {editingUser ? '(Deixe em branco para manter a atual)' : '*'}</span>
                  <Key className="w-3.5 h-3.5 text-indigo-400" />
                </label>
                <input
                  type="password"
                  required={!editingUser}
                  placeholder={editingUser ? '•••••••• (manter atual)' : 'Defina a senha inicial (ex: Temp#2026)'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Cargo / Papel RBAC *</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    {allowedRoles.map((r) => (
                      <option key={r.role} value={r.role}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Equipe</label>
                  <input
                    type="text"
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                <span>Autorizado por: </span>
                <strong className="text-indigo-300 capitalize">{userRole}</strong>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25"
                >
                  {editingUser ? 'Salvar Alterações' : 'Confirmar Cadastro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
