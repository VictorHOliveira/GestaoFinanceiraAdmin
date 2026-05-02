// Dashboard logic
let currentView = 'personal'; // 'personal' or 'shared'
let selectedSharedUser = null;

async function initDashboard() {
    const session = await checkAuth();
    if (!session) return;
    
    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Setup sharing
    await setupSharing();
    
    // Load dashboard data
    await loadDashboardData();
}

async function setupSharing() {
    // Load users I'm sharing with
    await loadSharedUsersList();
    
    // Load users who shared with me
    await loadAvailableSharedUsers();
    
    // Setup share button
    document.getElementById('shareBtn').addEventListener('click', async () => {
        const email = document.getElementById('shareEmail').value;
        if (!email) {
            showMessage('Insira um email valido', 'warning');
            return;
        }
        const success = await shareWithEmail(email);
        if (success) {
            document.getElementById('shareEmail').value = '';
            await loadSharedUsersList();
        }
    });
    
    // Setup personal data radio
    document.getElementById('viewPersonal').addEventListener('change', () => {
        if (document.getElementById('viewPersonal').checked) {
            currentView = 'personal';
            selectedSharedUser = null;
            loadDashboardData();
        }
    });
}

async function loadAvailableSharedUsers() {
    const sharedData = await loadAvailableSharedData();
    const sharedUsersList = document.getElementById('sharedUsersList');
    
    if (sharedData.length === 0) {
        sharedUsersList.innerHTML = '<p class="text-muted">Nenhum dado compartilhado</p>';
    } else {
        sharedUsersList.innerHTML = sharedData.map(item => `
            <div class="form-check">
                <input class="form-check-input" type="radio" name="dataView" id="viewShared${item.owner.id}" 
                       onchange="switchToShared('${item.owner.id}', '${item.owner.email}')">
                <label class="form-check-label" for="viewShared${item.owner.id}">
                    ${item.owner.email}
                </label>
            </div>
        `).join('');
    }
}

async function switchToShared(userId, email) {
    currentView = 'shared';
    selectedSharedUser = userId;
    showMessage('A ver dados de: ' + email, 'info');
    await loadDashboardData();
}

async function loadSharedUsersList() {
    const sharedUsers = await loadSharedUsers();
    const sharedList = document.getElementById('sharedList');
    
    if (sharedUsers.length === 0) {
        sharedList.innerHTML = '<p class="text-muted">Nenhum compartilhamento ativo</p>';
    } else {
        sharedList.innerHTML = sharedUsers.map(item => `
            <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                <span>${item.shared_with_email}</span>
                <button class="btn btn-sm btn-danger" onclick="handleRemoveShare(${item.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `).join('');
    }
}

async function handleRemoveShare(shareId) {
    if (confirm('Tem certeza que deseja remover este compartilhamento?')) {
        const success = await removeSharing(shareId);
        if (success) {
            await loadSharedUsersList();
        }
    }
}

async function loadDashboardData() {
    try {
        const now = getCurrentMonth();
        const { start, end } = getMonthRange(now.year, now.month);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        let expensesPromise, incomePromise, recentExpensesPromise, recentIncomePromise;
        
        if (currentView === 'shared' && selectedSharedUser) {
            expensesPromise = supabase.from('expenses').select('category, amount').eq('user_id', selectedSharedUser);
            incomePromise = supabase.from('income').select('category, amount').eq('user_id', selectedSharedUser);
            recentExpensesPromise = supabase.from('expenses').select('*').eq('user_id', selectedSharedUser).order('expense_date', { ascending: false }).limit(5);
            recentIncomePromise = supabase.from('income').select('*').eq('user_id', selectedSharedUser).order('income_date', { ascending: false }).limit(5);
        } else {
            expensesPromise = supabase.from('expenses').select('category, amount').eq('user_id', user.id).gte('expense_date', start).lte('expense_date', end);
            incomePromise = supabase.from('income').select('category, amount').eq('user_id', user.id).gte('income_date', start).lte('income_date', end);
            recentExpensesPromise = supabase.from('expenses').select('*').eq('user_id', user.id).order('expense_date', { ascending: false }).limit(5);
            recentIncomePromise = supabase.from('income').select('*').eq('user_id', user.id).order('income_date', { ascending: false }).limit(5);
        }
        
        const [expResult, incResult, recentExpResult, recentIncResult] = await Promise.all([
            expensesPromise,
            incomePromise,
            recentExpensesPromise,
            recentIncomePromise
        ]);
        
        const { data: expenses, error: expError } = expResult;
        const { data: income, error: incError } = incResult;
        const { data: recentExpenses, error: recentExpError } = recentExpResult;
        const { data: recentIncome, error: recentIncError } = recentIncResult;
        
        if (expError) console.error('Error loading expenses:', expError);
        if (incError) console.error('Error loading income:', incError);
        if (recentExpError) console.error('Error loading recent expenses:', recentExpError);
        if (recentIncError) console.error('Error loading recent income:', recentIncError);
        
        const expensesByCategory = {};
        if (expenses) {
            expenses.forEach(item => {
                expensesByCategory[item.category] = (expensesByCategory[item.category] || 0) + parseFloat(item.amount);
            });
        }
        
        const incomeByCategory = {};
        if (income) {
            income.forEach(item => {
                incomeByCategory[item.category] = (incomeByCategory[item.category] || 0) + parseFloat(item.amount);
            });
        }
        
        const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
        const totalIncome = Object.values(incomeByCategory).reduce((a, b) => a + b, 0);
        const balance = totalIncome - totalExpenses;
        
        document.getElementById('monthlyIncome').textContent = formatCurrency(totalIncome);
        document.getElementById('monthlyExpenses').textContent = formatCurrency(totalExpenses);
        document.getElementById('monthlyBalance').textContent = formatCurrency(balance);
        
        const recentExpensesDiv = document.getElementById('recentExpenses');
        if (!recentExpenses || recentExpenses.length === 0) {
            recentExpensesDiv.innerHTML = '<p class="text-muted">Nenhuma despesa registada</p>';
        } else {
            const html = recentExpenses.map(exp => `
                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                        <strong>${exp.category}</strong><br>
                        <small class="text-muted">${formatDate(exp.expense_date)}</small>
                    </div>
                    <span class="text-danger">-${formatCurrency(exp.amount)}</span>
                </div>
            `).join('');
            recentExpensesDiv.innerHTML = html;
        }
        
        const recentIncomeDiv = document.getElementById('recentIncome');
        if (!recentIncome || recentIncome.length === 0) {
            recentIncomeDiv.innerHTML = '<p class="text-muted">Nenhum rendimento registado</p>';
        } else {
            const html = recentIncome.map(inc => `
                <div class="d-flex justify-content-between align-items-center border-bottom py-2">
                    <div>
                        <strong>${inc.category}</strong><br>
                        <small class="text-muted">${formatDate(inc.income_date)}</small>
                    </div>
                    <span class="text-success">+${formatCurrency(inc.amount)}</span>
                </div>
            `).join('');
            recentIncomeDiv.innerHTML = html;
        }
    } catch (err) {
        console.error('Error in loadDashboardData:', err);
        showMessage('Erro ao carregar dados do dashboard', 'danger');
    }
}

initDashboard();
