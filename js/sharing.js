// Sharing logic
async function loadSharedUsers() {
    const currentUser = (await supabase.auth.getUser()).data.user;
    // I'm sharing with these users
    const { data, error } = await supabase
        .from('shared_access')
        .select('*, shared_with_email')
        .eq('owner_id', currentUser.id);
    
    if (error) {
        console.error('Error loading shared users:', error);
        return [];
    }
    return data;
}

async function shareWithEmail(email) {
    const currentUser = (await supabase.auth.getUser()).data.user;
    
    // Try to find user ID by email (if user already exists)
    const { data: existingUsers, error: searchError } = await supabase
        .from('shared_access')
        .select('shared_with_user_id')
        .eq('shared_with_email', email)
        .limit(1);
    
    let sharedWithUserId = null;
    if (!searchError && existingUsers && existingUsers.length > 0) {
        sharedWithUserId = existingUsers[0].shared_with_user_id;
    }
    
    // Add sharing
    const { data, error } = await supabase
        .from('shared_access')
        .insert([{
            owner_id: currentUser.id,
            shared_with_email: email,
            shared_with_user_id: sharedWithUserId
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
