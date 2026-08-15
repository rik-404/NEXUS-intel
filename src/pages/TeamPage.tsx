import React, { useState, useEffect } from 'react';
import { DataService } from '../lib/supabase';
import { UserProfile, UserRole } from '../lib/types';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  Mail, 
  Building2,
  KeyRound,
  RefreshCw
} from 'lucide-react';

interface TeamPageProps {
  userRole: UserRole;
}

export const TeamPage: React.FC<TeamPageProps> = ({ userRole }) => {
  const [users, setUsers] = useState<UserProfile[]>(() => DataService.getAllProfiles());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Modal Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [role, setRole] = useState<UserRole>('atendente');
  const [teamName, setTeamName] = useState('Suporte Geral');
  const [notification, setNotification] = useState<string | null>(null);

  // Fetch users live from Supabase PostgreSQL table on mount
  const loadUsersLive = async () => {
    setIsLoading(true);
    const liveProfiles = await DataService.fetchAllProfilesFromSupabase();
    setUsers(liveProfiles);
    setIsLoading(false);
  };

  useEffect(() => {
    loadUsersLive();
  }, []);

  // Determine authorized roles that logged-in user can create/manage based on RBAC hierarchy
  const getAssignableRoles = (): UserRole[] => {
    if (userRole === 'administrador') {
      return ['administrador', 'supervisor', 'lider', 'atendente', 'auditor'];
    }
    if (userRole === 'supervisor') {
      return ['lider', 'atendente', 'auditor'];
    }
    if (userRole === 'lider') {
      return ['atendente'];
    }
    return [];
  };

  const assignableRoles = getAssignableRoles();

  const handleOpenCreateModal = () => {
    setEditingUser(null);
    setFullName('');
    setEmail('');
    setNewPassword('');
    setRole(assignableRoles[0] || 'atendente');
    setTeamName('Suporte Geral');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (user: UserProfile) => {
    setEditingUser(user);
    setFullName(user.fullName);
    setEmail(user.email);
    setNewPassword('');
    setRole(user.role);
    setTeamName(user.teamName);
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) return;

    if (editingUser) {
      DataService.updateUser(editingUser.id, {
        fullName,
        email,
        role,
        teamName
      });
      setNotification(`Usuário "${fullName}" atualizado com sucesso!`);
    } else {
      DataService.registerUser({
        fullName,
        email,
        role,
        teamName
      });
      setNotification(`Novo usuário "${fullName}" cadastrado com sucesso!`);
    }

    // Refresh live list from Supabase
    await loadUsersLive();
    setIsModalOpen(false);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleToggleActive = async (userId: string) => {
    DataService.toggleUserActive(userId);
    await loadUsersLive();
  };

  const filteredUsers = users.filter(u => {
    const matchesRole = selectedRoleFilter === 'ALL' || u.role === selectedRoleFilter;
    const term = searchTerm.toLowerCase();
    const matchesSearch = 
      u.fullName.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      u.teamName.toLowerCase().includes(term);
    return matchesRole && matchesSearch;
  });

  const roleBadges: Record<UserRole, { label: string; color: string }> = {
    atendente: { label: 'Atendente', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
    lider: { label: 'Líder', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    supervisor: { label: 'Supervisor', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
    administrador: { label: 'Administrador (Dev)', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    auditor: { label: 'Auditor', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-400" />
            Gestão de Equipe & Usuários Internos
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cadastre novos colaboradores e gerencie cargos respeitando a hierarquia da organização.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadUsersLive}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Atualizar lista do Supabase"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-indigo-400' : ''}`} />
          </button>

          {assignableRoles.length > 0 && (
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Cadastrar Novo Usuário</span>
            </button>
          )}
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou equipe..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <span className="text-xs text-slate-400 font-medium">Filtrar Cargo:</span>
          <select
            value={selectedRoleFilter}
            onChange={(e) => setSelectedRoleFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="ALL">Todos os Cargos</option>
            <option value="administrador">Administrador</option>
            <option value="supervisor">Supervisor</option>
            <option value="lider">Líder</option>
            <option value="atendente">Atendente</option>
            <option value="auditor">Auditor</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="p-4">Colaborador</th>
                <th className="p-4">Cargo / Autoridade</th>
                <th className="p-4">Equipe</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs text-slate-300">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-xs">
                        {u.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{u.fullName}</p>
                        <p className="text-[11px] text-slate-400">{u.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold ${roleBadges[u.role]?.color}`}>
                      {roleBadges[u.role]?.label || u.role}
                    </span>
                  </td>

                  <td className="p-4 font-medium text-slate-300">
                    {u.teamName}
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => handleToggleActive(u.id)}
                      className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                        u.isActive 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                      }`}
                    >
                      {u.isActive ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>ATIVO</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>INATIVO</span>
                        </>
                      )}
                    </button>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleOpenEditModal(u)}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 font-semibold text-xs transition-colors"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              {editingUser ? `Editar Usuário: ${editingUser.fullName}` : 'Cadastrar Novo Usuário'}
            </h3>

            <form onSubmit={handleSaveUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlos Eduardo Silva"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">E-mail Corporativo *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="carlos.silva@empresa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Senha de Acesso *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder={editingUser ? 'Deixe em branco para manter a senha atual' : '••••••••'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cargo / Nível de Acesso *</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100"
                >
                  {assignableRoles.map(r => (
                    <option key={r} value={r}>
                      {roleBadges[r]?.label || r}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Equipe / Setor</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Ex: Suporte N2, Cobrança, SAC..."
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-lg shadow-indigo-500/25"
                >
                  Salvar Usuário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
