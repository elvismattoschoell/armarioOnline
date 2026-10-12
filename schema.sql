-- Script SQL Idempotente para Supabase / PostgreSQL
-- Tabela 'roupas' e Políticas de Segurança de Nível de Linha (RLS)

-- 1. Criação da tabela 'roupas' caso não exista
CREATE TABLE IF NOT EXISTS public.roupas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    cor VARCHAR(50),
    estacao VARCHAR(50),
    formalidade VARCHAR(50),
    marca VARCHAR(100),
    tamanho VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Ativo',
    imagem_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir adição de colunas marca, tamanho e status se a tabela já existir previamente
ALTER TABLE public.roupas ADD COLUMN IF NOT EXISTS marca VARCHAR(100);
ALTER TABLE public.roupas ADD COLUMN IF NOT EXISTS tamanho VARCHAR(50);
ALTER TABLE public.roupas ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Ativo';

-- Habilitar Row Level Security (RLS) na tabela 'roupas'
ALTER TABLE public.roupas ENABLE ROW LEVEL SECURITY;

-- 2. Remoção idempotente de políticas existentes antes da recriação
DROP POLICY IF EXISTS "Usuários comuns: Select próprio" ON public.roupas;
DROP POLICY IF EXISTS "Usuários comuns: Insert próprio" ON public.roupas;
DROP POLICY IF EXISTS "Usuários comuns: Update próprio" ON public.roupas;
DROP POLICY IF EXISTS "Usuários comuns: Delete próprio" ON public.roupas;
DROP POLICY IF EXISTS "Administrador: Select métricas agregadas" ON public.roupas;

-- 3. Políticas de RLS para Usuários Comuns (Acesso total SELECT, INSERT, UPDATE, DELETE aos seus próprios registros)
CREATE POLICY "Usuários comuns: Select próprio"
    ON public.roupas
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Usuários comuns: Insert próprio"
    ON public.roupas
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários comuns: Update próprio"
    ON public.roupas
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários comuns: Delete próprio"
    ON public.roupas
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- 4. Política de RLS para Administrador
CREATE POLICY "Administrador: Select métricas agregadas"
    ON public.roupas
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- ============================================================================
-- Tabela 'combinacoes' (Board View / Combinations) e Políticas RLS
-- ============================================================================

-- 1. Criação da tabela 'combinacoes' caso não exista
CREATE TABLE IF NOT EXISTS public.combinacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    canvas_state JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS) na tabela 'combinacoes'
ALTER TABLE public.combinacoes ENABLE ROW LEVEL SECURITY;

-- 2. Remoção idempotente de políticas existentes para 'combinacoes'
DROP POLICY IF EXISTS "Combinacoes: Select próprio" ON public.combinacoes;
DROP POLICY IF EXISTS "Combinacoes: Insert próprio" ON public.combinacoes;
DROP POLICY IF EXISTS "Combinacoes: Update próprio" ON public.combinacoes;
DROP POLICY IF EXISTS "Combinacoes: Delete próprio" ON public.combinacoes;
DROP POLICY IF EXISTS "Administrador: Select combinacoes agregadas" ON public.combinacoes;

-- 3. Políticas de RLS para Usuários Comuns na tabela 'combinacoes'
CREATE POLICY "Combinacoes: Select próprio"
    ON public.combinacoes
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Combinacoes: Insert próprio"
    ON public.combinacoes
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Combinacoes: Update próprio"
    ON public.combinacoes
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Combinacoes: Delete próprio"
    ON public.combinacoes
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Administrador: Select combinacoes agregadas"
    ON public.combinacoes
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- ============================================================================
-- Tabela 'colecoes' (Collections) e Políticas RLS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.colecoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    descricao TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.colecoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Colecoes: Select próprio" ON public.colecoes;
DROP POLICY IF EXISTS "Colecoes: Insert próprio" ON public.colecoes;
DROP POLICY IF EXISTS "Colecoes: Update próprio" ON public.colecoes;
DROP POLICY IF EXISTS "Colecoes: Delete próprio" ON public.colecoes;

CREATE POLICY "Colecoes: Select próprio" ON public.colecoes FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Colecoes: Insert próprio" ON public.colecoes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Colecoes: Update próprio" ON public.colecoes FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Colecoes: Delete próprio" ON public.colecoes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Tabela Associativa 'colecao_combinacoes'
CREATE TABLE IF NOT EXISTS public.colecao_combinacoes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    colecao_id UUID NOT NULL REFERENCES public.colecoes(id) ON DELETE CASCADE,
    combinacao_id UUID NOT NULL REFERENCES public.combinacoes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(colecao_id, combinacao_id)
);

ALTER TABLE public.colecao_combinacoes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "ColecaoCombinacoes: Select próprio" ON public.colecao_combinacoes;
DROP POLICY IF EXISTS "ColecaoCombinacoes: Insert próprio" ON public.colecao_combinacoes;
DROP POLICY IF EXISTS "ColecaoCombinacoes: Delete próprio" ON public.colecao_combinacoes;

CREATE POLICY "ColecaoCombinacoes: Select próprio" ON public.colecao_combinacoes FOR SELECT TO authenticated
    USING (EXISTS (SELECT 1 FROM public.colecoes c WHERE c.id = colecao_id AND c.user_id = auth.uid()));
CREATE POLICY "ColecaoCombinacoes: Insert próprio" ON public.colecao_combinacoes FOR INSERT TO authenticated
    WITH CHECK (EXISTS (SELECT 1 FROM public.colecoes c WHERE c.id = colecao_id AND c.user_id = auth.uid()));
CREATE POLICY "ColecaoCombinacoes: Delete próprio" ON public.colecao_combinacoes FOR DELETE TO authenticated
    USING (EXISTS (SELECT 1 FROM public.colecoes c WHERE c.id = colecao_id AND c.user_id = auth.uid()));

-- ============================================================================
-- Tabela 'wishlist' (Wishlist Items) e Políticas RLS
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    categoria VARCHAR(100),
    preco_estimado NUMERIC(10, 2),
    link_compra TEXT,
    imagem_url TEXT,
    status VARCHAR(50) DEFAULT 'Desejado', -- 'Desejado' / 'Adquirido'
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Wishlist: Select próprio" ON public.wishlist;
DROP POLICY IF EXISTS "Wishlist: Insert próprio" ON public.wishlist;
DROP POLICY IF EXISTS "Wishlist: Update próprio" ON public.wishlist;
DROP POLICY IF EXISTS "Wishlist: Delete próprio" ON public.wishlist;
DROP POLICY IF EXISTS "Administrador: Select wishlist agregada" ON public.wishlist;

CREATE POLICY "Wishlist: Select próprio" ON public.wishlist FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Wishlist: Insert próprio" ON public.wishlist FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Wishlist: Update próprio" ON public.wishlist FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Wishlist: Delete próprio" ON public.wishlist FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Administrador: Select wishlist agregada" ON public.wishlist FOR SELECT TO authenticated USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- ============================================================================
-- Função RPC para Contagem Total de Usuários (Admin)
-- ============================================================================

CREATE OR REPLACE FUNCTION public.get_total_users_count()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_count FROM auth.users;
    RETURN total_count;
END;
$$;
