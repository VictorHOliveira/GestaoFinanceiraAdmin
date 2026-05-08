# GestaoFinanceiraAdmin

Static personal finance admin app (Vanilla JS + Supabase).

## Deploy Mapping
| Domain | Repository |
|--------|------------|
| admin.qaoverflow.com | https://github.com/VictorHOliveira/GestaoFinanceiraAdmin |
| qaoverflow.com | https://github.com/VictorHOliveira/QA_OverFlow |

## Configuration
- **Supabase credentials**: Centralized in `js/config.js`:
  - `SUPABASE_URL`: Project URL
  - `SUPABASE_ANON_KEY`: Publishable key (safe for client-side, RLS protects data)
  - `CATEGORIES`, `INCOME_CATEGORIES`: Category definitions

- **All HTML pages** import `js/config.js` before using Supabase client.

## Pages
- `index.html`: Redirect to login
- `login.html`, `register.html`: Authentication
- `dashboard.html`: Main dashboard with monthly totals
- `expenses.html`, `income.html`: List views
- `add-expense.html`, `add-income.html`: Forms
- `reports.html`: Charts with Chart.js

## CI
- GitHub Pages: `.github/workflows/deploy.yml` (push to main)
- Custom domain: `CNAME` = `admin.qaoverflow.com`
- `.nojekyll` present to bypass Jekyll processing
