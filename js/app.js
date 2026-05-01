// GestaoFinanceira Web App - Lógica Principal

// Verificar autenticação
async function checkAuth() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = '/login.html';
    }
    return session;
}

// Logout
async function logout() {
    await supabase.auth.signOut();
    window.location.href = '/login.html';
}

// Formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
}

// Formatar data
function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-PT');
}

// Obter data atual em formato YYYY-MM-DD
function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

// Mostrar mensagem flash
function showMessage(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    setTimeout(() => alertDiv.remove(), 5000);
}

// Carregar despesas
async function loadExpenses() {
    const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('expense_date', { ascending: false });
    
    if (error) {
        showMessage('Erro ao carregar despesas: ' + error.message, 'danger');
        return [];
    }
    return data;
}

// Carregar rendimentos
async function loadIncome() {
    const { data, error } = await supabase
        .from('income')
        .select('*')
        .order('income_date', { ascending: false });
    
    if (error) {
        showMessage('Erro ao carregar rendimentos: ' + error.message, 'danger');
        return [];
    }
    return data;
}

// Adicionar despesa
async function addExpense(expense) {
    const { data, error } = await supabase
        .from('expenses')
        .insert([expense])
        .select();
    
    if (error) {
        showMessage('Erro ao adicionar despesa: ' + error.message, 'danger');
        return null;
    }
    showMessage('Despesa adicionada com sucesso!', 'success');
    return data[0];
}

// Adicionar rendimento
async function addIncome(income) {
    const { data, error } = await supabase
        .from('income')
        .insert([income])
        .select();
    
    if (error) {
        showMessage('Erro ao adicionar rendimento: ' + error.message, 'danger');
        return null;
    }
    showMessage('Rendimento adicionado com sucesso!', 'success');
    return data[0];
}

// Eliminar despesa
async function deleteExpense(id) {
    const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);
    
    if (error) {
        showMessage('Erro ao eliminar despesa: ' + error.message, 'danger');
        return false;
    }
    showMessage('Despesa eliminada com sucesso!', 'success');
    return true;
}

// Eliminar rendimento
async function deleteIncome(id) {
    const { error } = await supabase
        .from('income')
        .delete()
        .eq('id', id);
    
    if (error) {
        showMessage('Erro ao eliminar rendimento: ' + error.message, 'danger');
        return false;
    }
    showMessage('Rendimento eliminado com sucesso!', 'success');
    return true;
}

// Obter totais por categoria (despesas)
async function getExpensesByCategory(startDate = null, endDate = null) {
    let query = supabase
        .from('expenses')
        .select('category, amount');
    
    if (startDate) query = query.gte('expense_date', startDate);
    if (endDate) query = query.lte('expense_date', endDate);
    
    const { data, error } = await query;
    
    if (error) return {};
    
    const totals = {};
    data.forEach(item => {
        totals[item.category] = (totals[item.category] || 0) + parseFloat(item.amount);
    });
    return totals;
}

// Obter totais por categoria (rendimentos)
async function getIncomeByCategory(startDate = null, endDate = null) {
    let query = supabase
        .from('income')
        .select('category, amount');
    
    if (startDate) query = query.gte('income_date', startDate);
    if (endDate) query = query.lte('income_date', endDate);
    
    const { data, error } = await query;
    
    if (error) return {};
    
    const totals = {};
    data.forEach(item => {
        totals[item.category] = (totals[item.category] || 0) + parseFloat(item.amount);
    });
    return totals;
}

// Obter mês atual
function getCurrentMonth() {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

// Obter primeiro e último dia do mês
function getMonthRange(year, month) {
    const start = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
    return { start, end };
}
