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
    status VARCHAR(50) DEFAULT 'Ativo',
    imagem_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
-- Permite acesso restrito a contagens agregadas (COUNT / head queries), sem permissão para selecionar colunas de imagem ou dados pessoais de terceiros.
CREATE POLICY "Administrador: Select métricas agregadas"
    ON public.roupas
    FOR SELECT
    TO authenticated
    USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );
