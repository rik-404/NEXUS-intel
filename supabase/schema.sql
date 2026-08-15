-- =============================================================================
-- CENTRO DE INTELIGÊNCIA DO ATENDIMENTO - SCHEMA POSTGRESQL (SUPABASE)
-- Script 100% Idempotente e Re-executável
-- =============================================================================

-- Habilitar extensão pgvector para Fase 3 & 4 (Busca Semântica por Embeddings)
CREATE EXTENSION IF NOT EXISTS "vector";

-- 1. CRIAR TIPOS CUSTOMIZADOS E ENUMS (PROTEGIDOS)
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('atendente', 'lider', 'supervisor', 'administrador', 'auditor');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE kb_article_status AS ENUM ('rascunho', 'em_revisao', 'publicado', 'arquivado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_status AS ENUM ('aberto', 'em_analise', 'resolvido', 'cancelado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE incident_severity AS ENUM ('baixa', 'media', 'alta', 'critica');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE suggestion_status AS ENUM ('pendente', 'em_revisao', 'aprovado', 'rejeitado');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. TABELAS PRINCIPAIS
-- -----------------------------------------------------------------------------

-- Remover a FK restritiva em profiles caso tenha sido criada previamente
ALTER TABLE IF EXISTS public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- Profiles (Tabela de Usuários/Perfis)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'administrador',
    team_name TEXT DEFAULT 'Engenharia & Dev',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Categorias de Atendimento e Base de Conhecimento
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    icon_name TEXT DEFAULT 'folder',
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assuntos Específicos
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sintomas Padronizados (Fase 3/4 - IA Ready)
CREATE TABLE IF NOT EXISTS public.standard_symptoms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_id UUID REFERENCES public.subjects(id) ON DELETE SET NULL,
    code TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    embedding vector(1536),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turnos de Trabalho (Fase 2)
CREATE TABLE IF NOT EXISTS public.shifts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    supervisor_id UUID REFERENCES public.profiles(id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    status TEXT CHECK (status IN ('ativo', 'encerrado')) DEFAULT 'ativo',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Base de Conhecimento (Artigos)
CREATE TABLE IF NOT EXISTS public.kb_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    category_id UUID NOT NULL REFERENCES public.categories(id),
    author_id UUID NOT NULL REFERENCES public.profiles(id),
    reviewer_id UUID REFERENCES public.profiles(id),
    status kb_article_status NOT NULL DEFAULT 'publicado',
    current_version INT NOT NULL DEFAULT 1,
    helpful_count INT DEFAULT 0,
    not_helpful_count INT DEFAULT 0,
    views_count INT DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    linked_symptom_id UUID REFERENCES public.standard_symptoms(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ocorrências / Atendimentos Registrados (Fase 1)
CREATE TABLE IF NOT EXISTS public.occurrences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    protocol_number TEXT UNIQUE NOT NULL,
    attendant_id UUID NOT NULL REFERENCES public.profiles(id),
    shift_id UUID REFERENCES public.shifts(id),
    category_id UUID NOT NULL REFERENCES public.categories(id),
    subject_id UUID NOT NULL REFERENCES public.subjects(id),
    symptom_id UUID REFERENCES public.standard_symptoms(id),
    
    client_identifier_masked TEXT,
    system_name TEXT NOT NULL,
    free_description TEXT NOT NULL,
    recurrence_count INT DEFAULT 1,
    duration_seconds INT DEFAULT 0,
    
    resolved_by_kb_article_id UUID REFERENCES public.kb_articles(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TRIGGER AUTOMÁTICO DE SYNC DE USUÁRIOS AUTH DO SUPABASE
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role, team_name)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    'administrador',
    'Engenharia & Dev'
  )
  ON CONFLICT (email) DO UPDATE
  SET role = 'administrador', full_name = EXCLUDED.full_name;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger para auth.users se existir no Supabase
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'auth' AND table_name = 'users') THEN
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;

-- 4. HABILITAR ROW LEVEL SECURITY (RLS)
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

DROP POLICY IF EXISTS "Leitura de Assuntos" ON public.subjects;
CREATE POLICY "Leitura de Assuntos" ON public.subjects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Leitura de Ocorrencias" ON public.occurrences;
CREATE POLICY "Leitura de Ocorrencias" ON public.occurrences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Inserção de Ocorrencias" ON public.occurrences;
CREATE POLICY "Inserção de Ocorrencias" ON public.occurrences FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Leitura de KB" ON public.kb_articles;
CREATE POLICY "Leitura de KB" ON public.kb_articles FOR SELECT USING (true);

-- 5. SEED DATA ÚNICO PARA O DESENVOLVEDOR ADMIN
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
