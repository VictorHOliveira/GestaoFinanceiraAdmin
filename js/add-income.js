// Add income logic
async function initAddIncome() {
    const session = await checkAuth();
    if (!session) return;
    
    // Setup logout
    document.getElementById('logoutBtn').addEventListener('click', logout);
    
    // Load categories
    const categorySelect = document.getElementById('category');
    INCOME_CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat;
        categorySelect.appendChild(option);
    });
    
    // Set default date
    document.getElementById('income_date').value = getTodayDate();
    
    // Handle form submit
    document.getElementById('incomeForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const income = {
            user_id: session.user.id,
            category: document.getElementById('category').value,
            amount: parseFloat(document.getElementById('amount').value),
            description: document.getElementById('description').value,
            income_date: document.getElementById('income_date').value
        };
        
        const result = await addIncome(income);
        if (result) {
            setTimeout(() => {
                window.location.href = '/income.html';
            }, 1000);
        }
    });
}

initAddIncome();
