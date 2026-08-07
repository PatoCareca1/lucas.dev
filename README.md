# Lucas Daniel | Personal Portfolio

O portfólio oficial de Lucas Daniel, acessível em [lucasdaniel.dev.br](https://lucasdaniel.dev.br).

O projeto é dividido em dois serviços independentes:

* **`frontend/`** — SPA em React, hospedada de forma estática (Vercel/Netlify).
* **`backend/`** — API em Django + Django Ninja, com PostgreSQL, hospedada numa VM própria
  (Oracle Cloud). Serve o conteúdo de **Guides** e **Projetos** (Certificados entra no futuro).

## 🚀 Tecnologias Utilizadas

* **Frontend:** React + TypeScript, Vite, Tailwind
* **Backend:** Django + Django Ninja, PostgreSQL
* **Infra:** Docker Compose (dev e produção)

## 🛠️ Como rodar o projeto localmente

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Ou, a partir da raiz do repositório:

```bash
./dev.sh
```

### Backend

Requer Docker.

```bash
cp backend/.env.example backend/.env   # preencha SECRET_KEY e a senha do Postgres
docker compose up --build
```

Isso sobe o Postgres e a API Django em `http://localhost:8000` (com autoreload). Em outro
terminal, rode as migrações e crie um usuário admin:

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
```

* API: `http://localhost:8000/api/` (docs interativos em `http://localhost:8000/api/docs`)
* Admin: `http://localhost:8000/admin/`

O frontend em desenvolvimento aponta para essa API local via `VITE_API_URL`
(`frontend/.env.development`).

## 🚢 Deploy

O frontend segue no provedor estático de sempre. O backend roda em Docker Compose numa VM Oracle,
atrás de um reverse proxy com HTTPS — detalhes de deploy em produção serão documentados aqui junto
com os arquivos `docker-compose.prod.yml` / `Caddyfile`.
