// Dashboard logic
async function initDashboard() {
    const session = await checkAuth();
    if (!session) return;
    
    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    const now = getCurrentMonth();
    const { start, end } = getMonthRange(now.year, now.month);
    
    // Load monthly totals
    const expensesByCategory = await getExpensesByCategory(start, end);
    const incomeByCategory = await getIncomeByCategory(start, end);
    
    const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
    const totalIncome = Object.values(incomeByCategory).reduce((a, b) => a + b, 0);
    const balance = totalIncome - totalExpenses;
    
    document.getElementById('monthlyIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('monthlyExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('monthlyBalance').textContent = formatCurrency(balance);
    
    // Load recent expenses
    const expenses = await loadExpenses();
    const recentExpensesDiv = document.getElementById('recentExpenses');
    if (expenses.length === 0) {
        recentExpensesDiv.innerHTML = '<p class="text-muted">Nenhuma despesa registada</p>';
    } else {
        const html = expenses.slice(0, 5).map(exp => `
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
    const income = await loadIncome();
    const recentIncomeDiv = document.getElementById('recentIncome');
    if (income.length === 0) {
        recentIncomeDiv.innerHTML = '<p class="text-muted">Nenhum rendimento registado</p>';
    } else {
        const html = income.slice(0, 5).map(inc => `
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
