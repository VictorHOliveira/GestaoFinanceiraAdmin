# Gestão Financeira Web

Aplicação web estática para gestão financeira pessoal, hospedada em qaoverflow.com/admin.

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend as a Service**: Supabase (gratuito)
  - Autenticação de utilizadores
  - Base de dados PostgreSQL
  - Row Level Security (RLS)
- **UI Framework**: Bootstrap 5.3
- **Gráficos**: Chart.js
- **Deploy**: GitHub Actions + FTP

## Configuração

### 1. Criar Projeto no Supabase

1. Aceda a [supabase.com](https://supabase.com) e crie uma conta
2. Crie um novo projeto
3. Vá ao SQL Editor e execute o conteúdo de `sql/schema.sql`
4. Nas configurações do projeto (Project Settings > API), copie:
   - URL do projeto
   - chave anon/public

### 2. Configurar o Projeto

Edite o ficheiro `js/config.js` e substitua:

```javascript
const SUPABASE_URL = 'https://SEU_PROJETO.supabase.co';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANONIMA_AQUI';
```

### 3. Configurar GitHub Secrets

Para o deploy automático, adicione estes secrets no seu repositório GitHub:

- `FTP_USERNAME`: Utilizador FTP para qaoverflow.com
- `FTP_PASSWORD`: Password FTP

## Estrutura de Ficheiros

```
GestaoFinanceiraWeb/
├── .github/workflows/    # GitHub Actions
├── css/                  # Estilos
├── js/                   # JavaScript
│   ├── config.js         # Configuração Supabase
│   ├── app.js            # Funções principais
│   ├── login.js          # Login
│   ├── register.js       # Registo
│   ├── dashboard.js      # Dashboard
│   ├── expenses.js       # Lista despesas
│   ├── income-list.js    # Lista rendimentos
│   ├── add-expense.js    # Adicionar despesa
│   ├── add-income.js     # Adicionar rendimento
│   └── reports.js        # Relatórios
├── sql/                  # Schema da base de dados
├── login.html            # Página login
├── register.html         # Página registo
├── dashboard.html        # Dashboard principal
├── expenses.html         # Lista despesas
├── income.html           # Lista rendimentos
├── reports.html          # Relatórios
├── add-expense.html      # Formulário despesa
├── add-income.html       # Formulário rendimento
└── README.md
```

## Funcionalidades

- ✅ Registo e login de utilizadores
- ✅ Gestão de despesas (adicionar, listar, eliminar)
- ✅ Gestão de rendimentos (adicionar, listar, eliminar)
- ✅ Dashboard com totais mensais
- ✅ Relatórios com gráficos
- ✅ Dicas de poupança
- ✅ Row Level Security (cada utilizador só vê os seus dados)
- ✅ Design responsivo (mobile-friendly)

## Deploy

O deploy é feito automaticamente via GitHub Actions quando faz push para a branch `main`.
Os ficheiros são enviados via FTP para `qaoverflow.com/admin/`.

## Desenvolvimento Futuro

- [ ] Edição de despesas e rendimentos
- [ ] Filtros avançados por data
- [ ] Exportação de dados (PDF/Excel)
- [ ] Modo escuro
- [ ] PWA (Progressive Web App)
