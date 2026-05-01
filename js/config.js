// Configuração do Supabase
// Substitua pelos valores do seu projeto no Supabase (https://app.supabase.com)
const SUPABASE_URL = 'https://rpwekhubjuxplqxxsahe.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_lUBv2zvpGlFXHUqgui71lA_nazavnWw';

// Inicializar cliente Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Categorias
const CATEGORIES = [
    "Moradia (Aluguer/Hipoteca)",
    "Alimentação (Supermercado/Restaurantes)",
    "Transporte (Combustível/Transportes Públicos)",
    "Contas (Água/Eletricidade/Gás/Internet)",
    "Saúde (Médico/Farmácia)",
    "Educação (Propinas/Cursos)",
    "Lazer (Cinema/Viagens/Hobbies)",
    "Compras (Roupa/Eletrónicos)",
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
