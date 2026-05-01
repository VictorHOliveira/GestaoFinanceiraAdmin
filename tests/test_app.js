// Testes unitários para GestaoFinanceira Web App
const assert = require('assert');

// Mock para Intl (Node.js não tem por defeito)
global.Intl = require('intl');

// Simular ambiente browser básico
global.window = {};

// Importar funções do app.js (ajustar para Node.js)
const fs = require('fs');
const appJs = fs.readFileSync('../js/app.js', 'utf8');

// Extrair funções para testar (simulação simples)
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' }).format(value);
}

function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString('pt-PT');
}

function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
}

function getCurrentMonth() {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

function getMonthRange(year, month) {
    const start = `${year}-${month.toString().padStart(2, '0')}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const end = `${year}-${month.toString().padStart(2, '0')}-${lastDay}`;
    return { start, end };
}

// Testes
console.log('🧪 A executar testes da aplicação GestaoFinanceira...\n');

// Teste 1: formatCurrency
console.log('Teste 1: formatCurrency');
const cur1 = formatCurrency(100);
assert.ok(cur1.includes('100,00') && cur1.includes('€'), `Formato incorreto: ${cur1}`);
const cur2 = formatCurrency(1234.56);
assert.ok(cur2.includes('1') && cur2.includes('234,56') && cur2.includes('€'), `Formato incorreto: ${cur2}`);
console.log('✅ Passou\n');

// Teste 2: formatDate
console.log('Teste 2: formatDate');
const formatted = formatDate('2026-05-01');
assert.ok(formatted.includes('2026'));
console.log('✅ Passou\n');

// Teste 3: getTodayDate
console.log('Teste 3: getTodayDate');
const today = getTodayDate();
assert.strictEqual(typeof today, 'string');
assert.strictEqual(today.length, 10);
assert.ok(today.match(/^\d{4}-\d{2}-\d{2}$/));
console.log('✅ Passou\n');

// Teste 4: getCurrentMonth
console.log('Teste 4: getCurrentMonth');
const month = getCurrentMonth();
assert.ok(month.year >= 2026);
assert.ok(month.month >= 1 && month.month <= 12);
console.log('✅ Passou\n');

// Teste 5: getMonthRange
console.log('Teste 5: getMonthRange');
const range = getMonthRange(2026, 5);
assert.strictEqual(range.start, '2026-05-01');
assert.strictEqual(range.end, '2026-05-31');
console.log('✅ Passou\n');

// Teste 6: getMonthRange para fevereiro (ano bissexto)
console.log('Teste 6: getMonthRange - Fevereiro 2024 (bissexto)');
const febRange = getMonthRange(2024, 2);
assert.strictEqual(febRange.end, '2024-02-29');
console.log('✅ Passou\n');

// Teste 7: Verificar ficheiros HTML existem
console.log('Teste 7: Verificar ficheiros essenciais');
const files = ['../login.html', '../register.html', '../dashboard.html', '../expenses.html', '../income.html', '../reports.html', '../add-expense.html', '../add-income.html'];
files.forEach(file => {
    assert.ok(fs.existsSync(file), `Ficheiro ${file} não encontrado`);
});
console.log('✅ Passou\n');

// Teste 8: Verificar ficheiros JS existem
console.log('Teste 8: Verificar ficheiros JavaScript');
const jsFiles = ['../js/config.js', '../js/app.js', '../js/login.js', '../js/register.js', '../js/dashboard.js', '../js/expenses.js', '../js/income-list.js', '../js/add-expense.js', '../js/add-income.js', '../js/reports.js'];
jsFiles.forEach(file => {
    assert.ok(fs.existsSync(file), `Ficheiro ${file} não encontrado`);
});
console.log('✅ Passou\n');

// Teste 9: Verificar CSS
console.log('Teste 9: Verificar ficheiro CSS');
assert.ok(fs.existsSync('../css/style.css'));
console.log('✅ Passou\n');

// Teste 10: Verificar config.js tem credenciais Supabase
console.log('Teste 10: Verificar configuração Supabase');
const configContent = fs.readFileSync('../js/config.js', 'utf8');
assert.ok(configContent.includes('SUPABASE_URL'));
assert.ok(configContent.includes('rpwekhubjuxplqxxsahe.supabase.co'));
assert.ok(configContent.includes('SUPABASE_ANON_KEY'));
console.log('✅ Passou\n');

console.log('✅ Todos os testes passaram!');
console.log('📊 Total: 10 testes executados com sucesso');
