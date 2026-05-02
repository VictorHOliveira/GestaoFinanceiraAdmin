-- Remover tabela shared_access e políticas relacionadas
-- Execute este script no SQL Editor do Supabase

-- Remover políticas de shared_access
DROP POLICY IF EXISTS "Owners can manage their shares" ON shared_access;
DROP POLICY IF EXISTS "Users can view shares where they are invited" ON shared_access;

-- Remover políticas de expenses e income que referenciam shared_access
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view own income" ON income;

-- Recriar políticas simples (apenas dados próprios)
CREATE POLICY "Users can view own expenses" ON expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own income" ON income
    FOR SELECT USING (auth.uid() = user_id);

-- Remover tabela shared_access
DROP TABLE IF EXISTS shared_access;

-- Comentário
COMMENT ON TABLE expenses IS 'Despesas dos utilizadores (apenas dados próprios)';
COMMENT ON TABLE income IS 'Rendimentos dos utilizadores (apenas dados próprios)';
