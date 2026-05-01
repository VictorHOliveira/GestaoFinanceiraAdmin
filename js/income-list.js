// Income list logic
async function initIncomeList() {
    const session = await checkAuth();
    if (!session) return;
    
    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    const income = await loadIncome();
    const tbody = document.getElementById('incomeTable');
    let total = 0;
    
    if (income.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhum rendimento registado</td></tr>';
    } else {
        tbody.innerHTML = income.map(inc => {
            total += parseFloat(inc.amount);
            return `
                <tr>
                    <td>${formatDate(inc.income_date)}</td>
                    <td>${inc.category}</td>
                    <td>${inc.description || '-'}</td>
                    <td class="text-success">${formatCurrency(inc.amount)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="handleDeleteIncome(${inc.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    document.getElementById('totalIncome').textContent = formatCurrency(total);
}

async function handleDeleteIncome(id) {
    if (confirm('Tem certeza que deseja eliminar este rendimento?')) {
        const success = await deleteIncome(id);
        if (success) {
            initIncomeList();
        }
    }
}

initIncomeList();
