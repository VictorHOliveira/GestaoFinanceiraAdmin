-- Schema para compartilhamento de dados financeiros
-- Execute este script no SQL Editor do Supabase

-- Tabela de compartilhamento
CREATE TABLE IF NOT EXISTS shared_access (
    id BIGSERIAL PRIMARY KEY,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    shared_with_email TEXT NOT NULL,
    shared_with_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(owner_id, shared_with_email)
);

-- Habilitar RLS
ALTER TABLE shared_access ENABLE ROW LEVEL SECURITY;

-- Políticas: apenas o proprietário pode gerir compartilhamentos
CREATE POLICY "Owners can manage their shares" ON shared_access
    FOR ALL USING (auth.uid() = owner_id);

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_shared_access_updated_at BEFORE UPDATE ON shared_access
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Modificar políticas das tabelas expenses e income para permitir acesso compartilhado
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
CREATE POLICY "Users can view own expenses" ON expenses
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM shared_access 
            WHERE owner_id = expenses.user_id 
            AND shared_with_user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can view own income" ON income;
CREATE POLICY "Users can view own income" ON income
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM shared_access 
            WHERE owner_id = income.user_id 
            AND shared_with_user_id = auth.uid()
        )
    );

-- Comentários
COMMENT ON TABLE shared_access IS 'Compartilhamento de dados financeiros entre utilizadores';
