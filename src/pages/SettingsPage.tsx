import React from 'react';
import { Settings, Database, ShieldCheck, Key, RefreshCw, Server } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          Configurações da Plataforma
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Conexão de banco de dados, chaves Supabase, políticas RLS e governança do sistema.
        </p>
      </div>

      {/* Database Connection Panel */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
              <Database className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Status da Conexão Supabase</h3>
              <p className="text-xs text-slate-400">PostgreSQL + Auth + Row Level Security + Realtime</p>
            </div>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            isSupabaseConfigured 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}>
            {isSupabaseConfigured ? 'Conectado ao Supabase Cloud' : 'Modo Local (Mock Storage Ativo)'}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3 text-xs text-slate-300">
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span>VITE_SUPABASE_URL:</span>
            <span className="text-slate-400">{import.meta.env.VITE_SUPABASE_URL || 'https://mock.supabase.co'}</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span>Políticas RLS:</span>
            <span className="text-emerald-400 font-bold">Ativadas no Banco</span>
          </div>
          <div className="flex items-center justify-between font-mono text-[11px]">
            <span>Mascaramento LGPD:</span>
            <span className="text-emerald-400 font-bold">Ativo em Tempo Real</span>
          </div>
        </div>
      </div>

      {/* Script DDL PostgreSQL Download/View Notification */}
      <div className="glass-panel rounded-2xl border border-indigo-500/30 p-6 space-y-3">
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Script DDL PostgreSQL (`supabase/schema.sql`)</h3>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          O arquivo com o script SQL completo contendo todas as tabelas, tipos ENUM, chave estrangeiras e políticas de segurança RLS foi gerado na raiz da aplicação em <code>supabase/schema.sql</code>.
        </p>
      </div>
    </div>
  );
};
