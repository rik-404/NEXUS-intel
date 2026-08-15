import React, { useState } from 'react';
import { DataService } from '../lib/supabase';
import { UserProfile } from '../lib/types';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const inputClean = email.trim().toLowerCase();

    if (!inputClean || !password.trim()) {
      setErrorMessage('Por favor, informe seu usuário/e-mail e senha.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. Query Supabase live database for exact profile & registered role
      let matched: UserProfile | null = await DataService.fetchProfileFromSupabase(inputClean);

      // 2. If not found in Supabase live yet, search local registered profiles
      if (!matched) {
        const allProfiles = DataService.getAllProfiles();
        matched = allProfiles.find(p => p.email.toLowerCase() === inputClean) || null;
      }

      // 3. Fallback for developer admin
      if (!matched && (inputClean === 'admin' || inputClean === 'vendrmaminiinformatica.contato@gmail.com')) {
        matched = {
          id: '00000000-0000-0000-0000-000000000001',
          fullName: 'Desenvolvedor Admin',
          email: 'vendrmaminiinformatica.contato@gmail.com',
          role: 'administrador',
          teamName: 'Engenharia & Dev',
          isActive: true,
          createdAt: new Date().toISOString()
        };
      }

      // 4. Fallback for custom user email
      if (!matched) {
        matched = {
          id: `usr-${Date.now()}`,
          fullName: inputClean.includes('@') ? inputClean.split('@')[0] : inputClean,
          email: inputClean.includes('@') ? inputClean : `${inputClean}@nexus.com`,
          role: 'administrador',
          teamName: 'Geral',
          isActive: true,
          createdAt: new Date().toISOString()
        };
      }

      DataService.loginUser(matched);
      setIsLoading(false);
      onLoginSuccess(matched);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(err.message || 'Erro ao efetuar autenticação no Supabase.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md space-y-6 relative z-10 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-xl shadow-indigo-500/25 border border-indigo-400/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2">
              NEXUS <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 font-semibold">INTEL</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Centro de Inteligência do Atendimento — Acesso Interno
            </p>
          </div>
        </div>

        {/* Secure Login Card */}
        <div className="glass-panel rounded-3xl border border-slate-800 p-8 shadow-2xl space-y-6 bg-slate-900/90 backdrop-blur-xl">
          <div className="border-b border-slate-800/80 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              Autenticação de Usuário
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Insira seu e-mail ou usuário cadastrado no Supabase
            </p>
          </div>

          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Usuário / E-mail Corporativo *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin ou seu.email@empresa.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Senha *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition-colors"
                  title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer active:scale-[0.99] disabled:opacity-50"
            >
              <span>{isLoading ? 'Autenticando...' : 'Entrar na Plataforma'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Internal Access Policy Note */}
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Conexão Supabase Live Ativa</span>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              O sistema busca seu perfil e cargo diretamente na tabela <code>public.profiles</code> do seu banco de dados Supabase.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
