-- =================================================================------------
-- CENTRO DE INTELIGÊNCIA DO ATENDIMENTO (NEXUS) - SCHEMA COMPLETO SUPABASE
-- DDL Idempotente com Suporte a RLS, Enum, Vector e 20 Categorias Oficiais
-- =================================================================------------

-- Ativar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. ENUMS CUSTOMIZADOS (Protegidos contra recriação duplicada)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('atendente', 'lider', 'supervisor', 'administrador', 'auditor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.shift_status AS ENUM ('ativo', 'encerrado', 'pausado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.article_status AS ENUM ('rascunho', 'em_revisao', 'publicado', 'arquivado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.incident_severity AS ENUM ('baixa', 'media', 'alta', 'critica');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. ESTRUTURA DE TABELAS (DDL)
-- -----------------------------------------------------------------------------

-- Tabela de Perfis de Usuários (sem restrição FK estrita em auth.users para permitir setup inicial)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role public.user_role NOT NULL DEFAULT 'atendente',
    team_name TEXT DEFAULT 'Geral',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categorias de Atendimento
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Assuntos Específicos por Categoria
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sintomas Padronizados (Fase 3 com pgvector)
CREATE TABLE IF NOT EXISTS public.standard_symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    embedding vector(1536),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Turnos de Atendimento
CREATE TABLE IF NOT EXISTS public.shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    supervisor_id UUID REFERENCES public.profiles(id),
    status public.shift_status NOT NULL DEFAULT 'ativo',
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ
);

-- Passagem de Turno (Handover)
CREATE TABLE IF NOT EXISTS public.shift_handovers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shift_id UUID REFERENCES public.shifts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id),
    pending_tasks TEXT,
    shift_alerts TEXT,
    observations TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ocorrências de Atendimento
CREATE TABLE IF NOT EXISTS public.occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_number TEXT UNIQUE NOT NULL,
    attendant_id UUID REFERENCES public.profiles(id),
    shift_id UUID REFERENCES public.shifts(id),
    category_id UUID REFERENCES public.categories(id),
    subject_id UUID REFERENCES public.subjects(id),
    symptom_id UUID REFERENCES public.standard_symptoms(id),
    client_identifier_masked TEXT NOT NULL,
    system_name TEXT NOT NULL,
    free_description TEXT NOT NULL,
    recurrence_count INT DEFAULT 1,
    duration_seconds INT DEFAULT 0,
    resolved_by_kb_article_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Artigos da Base de Conhecimento
CREATE TABLE IF NOT EXISTS public.kb_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    category_id UUID REFERENCES public.categories(id),
    author_id UUID REFERENCES public.profiles(id),
    status public.article_status NOT NULL DEFAULT 'rascunho',
    current_version INT DEFAULT 1,
    helpful_count INT DEFAULT 0,
    not_helpful_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Módulo de Incidentes Críticos (Fase 3)
CREATE TABLE IF NOT EXISTS public.incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    severity public.incident_severity NOT NULL DEFAULT 'media',
    is_active BOOLEAN DEFAULT true,
    affected_system TEXT,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

-- 3. HABILITAR ROW LEVEL SECURITY (RLS)
-- -----------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.occurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kb_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Leitura de Perfis" ON public.profiles;
CREATE POLICY "Leitura de Perfis" ON public.profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserção de Perfis" ON public.profiles;
CREATE POLICY "Inserção de Perfis" ON public.profiles FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Edição de Perfis" ON public.profiles;
CREATE POLICY "Edição de Perfis" ON public.profiles FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Leitura de Categorias" ON public.categories;
CREATE POLICY "Leitura de Categorias" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserção de Categorias" ON public.categories;
CREATE POLICY "Inserção de Categorias" ON public.categories FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Leitura de Assuntos" ON public.subjects;
CREATE POLICY "Leitura de Assuntos" ON public.subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura de Ocorrencias" ON public.occurrences;
CREATE POLICY "Leitura de Ocorrencias" ON public.occurrences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserção de Ocorrencias" ON public.occurrences;
CREATE POLICY "Inserção de Ocorrencias" ON public.occurrences FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Leitura de KB" ON public.kb_articles;
CREATE POLICY "Leitura de KB" ON public.kb_articles FOR SELECT USING (true);

-- 4. SEED DATA ÚNICO PARA O DESENVOLVEDOR ADMIN E 20 CATEGORIAS OFICIAIS
-- -----------------------------------------------------------------------------
INSERT INTO public.profiles (id, full_name, email, role, team_name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Desenvolvedor Admin',
  'vendrmaminiinformatica.contato@gmail.com',
  'administrador',
  'Engenharia & Dev'
) 
ON CONFLICT (email) DO UPDATE 
SET role = 'administrador', full_name = 'Desenvolvedor Admin';

INSERT INTO public.categories (name, slug, description, icon_name, display_order)
VALUES 
  ('Bônus e Promoções', 'bonus-promocoes', 'Regras de rollover, ativação de bônus, giros grátis e promoções vigentes', 'Gift', 1),
  ('Não Houve Contato', 'nao-houve-contato', 'Chamados encerrados sem resposta do cliente ou desconexão prematura', 'PhoneOff', 2),
  ('Cashback', 'cashback', 'Cálculo de programa de fidelidade, reembolso de perdas e créditos', 'Coins', 3),
  ('Cassino Ao Vivo', 'cassino-ao-vivo', 'Problemas em roleta, blackjack, baccarat e provedores como Evolution/Pragmatic', 'Tv', 4),
  ('Depósito', 'deposito', 'PIX pendente, atraso no envio de saldo, comprovantes e gateway de pagamento', 'ArrowDownCircle', 5),
  ('Auto Exclusão', 'auto-exclusao', 'Jogo responsável, pausa temporária ou bloqueio definitivo solicitado pelo usuário', 'UserX', 6),
  ('Saque', 'saque', 'Solicitação de retirada, análise de segurança, limite de saque e chave PIX', 'ArrowUpCircle', 7),
  ('SMS', 'sms', 'Falhas no envio do código de verificação via SMS e validação de telefone', 'MessageSquare', 8),
  ('Cadastro', 'cadastro', 'Alteração de dados cadastrais, erro de validação CPF e duplicidade de conta', 'UserCheck', 9),
  ('Contas Banidas', 'contas-banidas', 'Suspeita de fraudes, uso de robôs, contas vinculadas e violação de T&C', 'Ban', 10),
  ('Torneios', 'torneios', 'Classificação de liderança, premiação de lideres e regras de torneio', 'Trophy', 11),
  ('GOS (Gestão Operacional de Segurança)', 'gos', 'Auditorias de segurança interna, verificação de comportamento e compliance', 'ShieldAlert', 12),
  ('Contestação', 'contestacao', 'Chargebacks, disputas financeiras e contestação de apostas resolvidas', 'AlertCircle', 13),
  ('Histórico Financeiro', 'historico-financeiro', 'Relatório de transações, extrato detalhado de apostas e movimentações', 'Receipt', 14),
  ('Cassino Slots', 'cassino-slots', 'Jogos de caça-níqueis, rodadas trancadas, spingate e falhas de provedores', 'Dices', 15),
  ('Imposto de Renda', 'imposto-de-renda', 'Declaração de prêmios, retenção na fonte e tributação de apostas esportivas', 'FileText', 16),
  ('KYC (Verificação de Identidade)', 'kyc', 'Envio de documentos, selfie com documento, comprovante de residência e aprovação', 'BadgeCheck', 17),
  ('Instabilidade', 'instabilidade', 'Lentidão no site/app, erros 500/502/504, quedas de servidor e manutenção', 'Activity', 18),
  ('Crash Games', 'crash-games', 'Aviator, Spaceman, JetX, apostas presas e fechamento automático de rodada', 'Zap', 19),
  ('E-mail', 'email', 'Envio e recebimento de e-mails institucionais, redefinição de senha e suporte', 'Mail', 20)
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description, icon_name = EXCLUDED.icon_name;
