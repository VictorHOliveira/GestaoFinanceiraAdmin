-- Remover completamente o compartilhamento de dados
-- Execute no SQL Editor do Supabase

-- 1. Remover políticas que referenciam shared_access
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view own income" ON income;

-- 2. Recriar políticas simples (apenas dados próprios)
CREATE POLICY "Users can view own expenses" ON expenses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own income" ON income
    FOR SELECT USING (auth.uid() = user_id);

-- 3. Remover tabela shared_access
DROP TABLE IF EXISTS shared_access;

-- 4. Comentários
COMMENT ON TABLE expenses IS 'Despesas dos utilizadores (apenas dados próprios)';
COMMENT ON TABLE income IS 'Rendimentos dos utilizadores (apenas dados próprios)';
