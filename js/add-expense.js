// Add expense logic
async function initAddExpense() {
    const session = await checkAuth();
    if (!session) return;
    
    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Load categories
    const categorySelect = document.getElementById('category');
    CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
    
    // Set default date
    document.getElementById('expense_date').value = getTodayDate();
    
    // Handle form submit
    document.getElementById('expenseForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const expense = {
            user_id: session.user.id,
            category: document.getElementById('category').value,
            amount: parseFloat(document.getElementById('amount').value),
            description: document.getElementById('description').value,
            expense_date: document.getElementById('expense_date').value
        };
        
        const result = await addExpense(expense);
        if (result) {
            setTimeout(() => {
                window.location.href = '/admin/expenses.html';
            }, 1000);
        }
    });
}

initAddExpense();
