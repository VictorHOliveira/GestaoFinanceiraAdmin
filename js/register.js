// Register logic
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    if (!registerForm) {
        console.error('registerForm not found');
        return;
    }
    
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        
        if (password !== confirmPassword) {
            const alertContainer = document.getElementById('alert-container');
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show">
                    As passwords não coincidem
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            return;
        }
        
        if (password.length < 8) {
            const alertContainer = document.getElementById('alert-container');
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show">
                    Password deve ter pelo menos 8 caracteres
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            return;
        }
        
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) {
            const alertContainer = document.getElementById('alert-container');
            alertContainer.innerHTML = `
                <div class="alert alert-danger alert-dismissible fade show">
                    Erro ao registar: ${error.message}
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
        } else {
            const alertContainer = document.getElementById('alert-container');
            alertContainer.innerHTML = `
                <div class="alert alert-success alert-dismissible fade show">
                    Registo concluído! Verifique o seu email para confirmar a conta.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                </div>
            `;
            setTimeout(() => {
                window.location.href = '/login.html';
            }, 3000);
        }
    });
});
