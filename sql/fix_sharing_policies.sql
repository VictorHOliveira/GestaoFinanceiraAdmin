-- Fix sharing policies for proper access
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own expenses" ON expenses;
DROP POLICY IF EXISTS "Users can view own income" ON income;

-- Create new policies that handle NULL shared_with_user_id
CREATE POLICY "Users can view own expenses" ON expenses
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM shared_access 
            WHERE owner_id = expenses.user_id 
            AND shared_with_user_id = auth.uid()
            AND shared_with_user_id IS NOT NULL
        )
    );

CREATE POLICY "Users can view own income" ON income
    FOR SELECT USING (
        auth.uid() = user_id OR 
        EXISTS (
            SELECT 1 FROM shared_access 
            WHERE owner_id = income.user_id 
            AND shared_with_user_id = auth.uid()
            AND shared_with_user_id IS NOT NULL
        )
    );

-- Create a function to update shared_with_user_id when user confirms email
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
    -- Update shared_access with the new user's ID
    UPDATE shared_access 
    SET shared_with_user_id = NEW.id
    WHERE shared_with_email = NEW.email;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically link shared_access when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
