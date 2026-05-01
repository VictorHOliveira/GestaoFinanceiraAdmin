// Sharing logic
async function loadSharedUsers() {
    const { data, error } = await supabase
        .from('shared_access')
        .select('*, shared_user:auth.users!shared_with_user_id(email)')
        .eq('owner_id', (await supabase.auth.getUser()).data.user.id);
    
    if (error) {
        console.error('Error loading shared users:', error);
        return [];
    }
    return data;
}

async function shareWithEmail(email) {
    const currentUser = (await supabase.auth.getUser()).data.user;
    
    // Add sharing
    const { data, error } = await supabase
        .from('shared_access')
        .insert([{
            owner_id: currentUser.id,
            shared_with_email: email
        }])
        .select();
    
    if (error) {
        showMessage('Erro ao compartilhar: ' + error.message, 'danger');
        return false;
    }
    
    showMessage('Dados compartilhados com sucesso!', 'success');
    return true;
}

async function removeSharing(shareId) {
    const { error } = await supabase
        .from('shared_access')
        .delete()
        .eq('id', shareId);
    
    if (error) {
        showMessage('Erro ao remover compartilhamento: ' + error.message, 'danger');
        return false;
    }
    
    showMessage('Compartilhamento removido!', 'success');
    return true;
}

async function loadAvailableSharedData() {
    const { data, error } = await supabase
        .from('shared_access')
        .select('*, owner:auth.users!owner_id(email)')
        .not('shared_with_user_id', 'is', null);
    
    if (error) {
        console.error('Error loading shared data:', error);
        return [];
    }
    return data;
}
