// Supabase config
const SUPABASE_URL = 'https://rpwekhubjuxplqxxsahe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_lUBv2zvpGlFXHUqgui71lA_nazavnWw';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Categories
const CATEGORIES = [
    "Moradia (Aluguer/Hipoteca)",
    "Alimentacao (Supermercado/Restaurantes)",
    "Transporte (Combustivel/Transportes Publicos)",
    "Contas (Agua/Eletricidade/Gas/Internet)",
    "Saude (Medico/Farmacia)",
    "Educacao (Propinas/Cursos)",
    "Lazer (Cinema/Viagens/Hobbies)",
    "Compras (Roupa/Eletronicos)",
    "Outros"
];

const INCOME_CATEGORIES = [
    "Ordenado",
    "Trabalho Extra",
    "Investimentos (Dividendos/Juros)",
    "Vendas",
    "Rendas Recebidas",
    "Outros Rendimentos"
];
