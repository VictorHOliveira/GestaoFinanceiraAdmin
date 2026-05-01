// Reports logic
async function initReports() {
    const session = await checkAuth();
    if (!session) return;
    
    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    const now = getCurrentMonth();
    const { start: monthStart, end: monthEnd } = getMonthRange(now.year, now.month);
    
    // Load current month data
    const expensesByCategory = await getExpensesByCategory(monthStart, monthEnd);
    const incomeByCategory = await getIncomeByCategory(monthStart, monthEnd);
    
    const totalExpenses = Object.values(expensesByCategory).reduce((a, b) => a + b, 0);
    const totalIncome = Object.values(incomeByCategory).reduce((a, b) => a + b,0);
    const balance = totalIncome - totalExpenses;
    
    document.getElementById('currentIncome').textContent = formatCurrency(totalIncome);
    document.getElementById('currentExpenses').textContent = formatCurrency(totalExpenses);
    document.getElementById('currentBalance').textContent = formatCurrency(balance);
    
    // Category chart
    const catLabels = Object.keys(expensesByCategory);
    const catData = Object.values(expensesByCategory);
    const catCtx = document.getElementById('categoryChart').getContext('2d');
    new Chart(catCtx, {
        type: 'pie',
        data: {
            labels: catLabels.length ? catLabels : ['Sem dados'],
            datasets: [{
                data: catData.length ? catData : [1],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom' }
            }
        }
    });
    
    // Monthly chart (last 6 months)
    const months = [];
    const monthExpenseData = [];
    const monthIncomeData = [];
    
    for (let i = 5; i >= 0; i--) {
        let m = now.month - i;
        let y = now.year;
        if (m <= 0) {
            m += 12;
            y -= 1;
        }
        const { start, end } = getMonthRange(y, m);
        months.push(`${y}-${m.toString().padStart(2, '0')}`);
        
        const monthExp = await getExpensesByCategory(start, end);
        const monthInc = await getIncomeByCategory(start, end);
        monthExpenseData.push(Object.values(monthExp).reduce((a, b) => a + b, 0));
        monthIncomeData.push(Object.values(monthInc).reduce((a, b) => a + b, 0));
    }
    
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    new Chart(monthlyCtx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Despesas',
                data: monthExpenseData,
                borderColor: '#dc3545',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                tension: 0.1
            }, {
                label: 'Rendimentos',
                data: monthIncomeData,
                borderColor: '#198754',
                backgroundColor: 'rgba(25, 135, 84, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
    
    // Tips
    const tipsContainer = document.getElementById('tipsContainer');
    if (totalExpenses > 0) {
        const topCats = Object.entries(expensesByCategory)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3);
        
        const tipsHtml = topCats.map(([cat, amt]) => `
            <div class="alert alert-info">
                <strong>${cat}:</strong> Gastou ${formatCurrency(amt)} este mês.
                Reduzir 10% pouparia ${formatCurrency(amt * 0.1)}/mês.
                Reduzir 20% pouparia ${formatCurrency(amt * 0.2)}/mês.
            </div>
        `).join('');
        tipsContainer.innerHTML = tipsHtml || '<p class="text-muted">Sem dicas disponíveis</p>';
    } else {
        tipsContainer.innerHTML = '<p class="text-muted">Sem dados para exibir dicas</p>';
    }
}

initReports();
