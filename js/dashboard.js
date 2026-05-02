// Dashboard logic
async function initDashboard() {
    const session = await checkAuth();
    if (!session) return;
    
    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Load dashboard data
    await loadDashboardData();
}

async function loadDashboardData() {
    try {
        const now = getCurrentMonth();
        const { start, end } = getMonthRange(now.year, now.month);
        
        const { data: { user } } = await supabase.auth.getUser();
        
        // Load totals by category (personal data only)
        const expensesPromise = supabase.from('expenses').select('category, amount').eq('user_id', user.id).gte('expense_date', start).lte('expense_date', end);
        const incomePromise = supabase.from('income').select('category, amount').eq('user_id', user.id).gte('income_date', start).lte('income_date', end);
        const recentExpensesPromise = supabase.from('expenses').select('*').eq('user_id', user.id).order('expense_date', { ascending: false }).limit(5);
        const recentIncomePromise = supabase.from('income').select('*').eq('user_id', user.id).order('income_date', { ascending: false }).limit(5);
        
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
