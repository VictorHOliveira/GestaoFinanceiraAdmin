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
    const now = getCurrentMonth();
    const { start, end } = getMonthRange(now.year, now.month);
    
    let expensesByCategory, incomeByCategory;
    
    if (currentView === 'shared' && selectedSharedUser) {
        // Load shared user's data
        const { data: expenses, error: expError } = await supabase
            .from('expenses')
            .select('category, amount')
            .eq('user_id', selectedSharedUser);
        
        const { data: income, error: incError } = await supabase
            .from('income')
            .select('category, amount')
            .eq('user_id', selectedSharedUser);
        
        expensesByCategory = {};
        if (expenses) {
            expenses.forEach(item => {
                expensesByCategory[item.category] = (expensesByCategory[item.category] || 0) + parseFloat(item.amount);
            });
        }
        
        incomeByCategory = {};
        if (income) {
            income.forEach(item => {
                incomeByCategory[item.category] = (incomeByCategory[item.category] || 0) + parseFloat(item.amount);
            });
        }
    } else {
        // Load personal data
        expensesByCategory = await getExpensesByCategory(start, end);
        incomeByCategory = await getIncomeByCategory(start, end);
    }
    
    const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
    const totalIncome = Object.values(incomeByCategory).reduce((a, b) => a + b, 0);
    const balance = totalIncome - totalExpenses;
    
    document.getElementById('monthlyIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('monthlyExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('monthlyBalance').textContent = formatCurrency(balance);
    
    // Load recent expenses
    let expensesQuery = supabase.from('expenses').select('*');
    if (currentView === 'shared' && selectedSharedUser) {
        expensesQuery = expensesQuery.eq('user_id', selectedSharedUser);
    }
    const { data: expenses, error: expError } = await expensesQuery
        .order('expense_date', { ascending: false })
        .limit(5);
    
    const recentExpensesDiv = document.getElementById('recentExpenses');
    if (!expenses || expenses.length === 0) {
        recentExpensesDiv.innerHTML = '<p class="text-muted">Nenhuma despesa registada</p>';
    } else {
        const html = expenses.map(exp => `
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
    
    // Load recent income
    let incomeQuery = supabase.from('income').select('*');
    if (currentView === 'shared' && selectedSharedUser) {
        incomeQuery = incomeQuery.eq('user_id', selectedSharedUser);
    }
    const { data: income, error: incError } = await incomeQuery
        .order('income_date', { ascending: false })
        .limit(5);
    
    const recentIncomeDiv = document.getElementById('recentIncome');
    if (!income || income.length === 0) {
        recentIncomeDiv.innerHTML = '<p class="text-muted">Nenhum rendimento registado</p>';
    } else {
        const html = income.map(inc => `
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
}

initDashboard();
