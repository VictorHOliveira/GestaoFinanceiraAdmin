// Expenses list logic
async function initExpenses() {
    const session = await checkAuth();
    if (!session) return;
    
    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    const expenses = await loadExpenses();
    const tbody = document.getElementById('expensesTable');
    let total = 0;
    
    if (expenses.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma despesa registada</td></tr>';
    } else {
        tbody.innerHTML = expenses.map(exp => {
            total += parseFloat(exp.amount);
            return `
                <tr>
                    <td>${formatDate(exp.expense_date)}</td>
                    <td>${exp.category}</td>
                    <td>${exp.description || '-'}</td>
                    <td class="text-danger">${formatCurrency(exp.amount)}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="handleDeleteExpense(${exp.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }
    
    document.getElementById('totalExpenses').textContent = formatCurrency(total);
}

async function handleDeleteExpense(id) {
    if (confirm('Tem certeza que deseja eliminar esta despesa?')) {
        const success = await deleteExpense(id);
        if (success) {
            initExpenses();
        }
    }
}

initExpenses();
