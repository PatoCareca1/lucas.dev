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

Depois, popule o conteúdo de Guides e Projetos com os seeds:

```bash
docker compose exec backend python manage.py seed_guides
docker compose exec backend python manage.py seed_projects
```

* API: `http://localhost:8000/api/` (docs interativos em `http://localhost:8000/api/docs`)
* Admin: `http://localhost:8000/admin/`

O frontend em desenvolvimento aponta para essa API local via `VITE_API_URL`
(`frontend/.env.development`).

## 🌱 Seeds

O conteúdo de Guides e Projetos vive no banco, não no código do frontend. Dois management
commands populam as tabelas a partir de snapshots JSON versionados dentro do próprio app:

| Comando | O que importa | Fonte |
| --- | --- | --- |
| `seed_guides` | Os 3 capítulos de Guides em pt e en (6 registros) | `backend/guides/management/commands/data/guides.json` |
| `seed_projects` | Os 7 projetos, cada um com tradução pt e en | `backend/projects/management/commands/data/projects.json` |

Ambos fazem **upsert** (`update_or_create`), então são seguros de re-rodar: `seed_guides` casa
por `(slug, language)` e `seed_projects` por `slug` e `(project, language)`. Rodar de novo
sobrescreve edições feitas no `/admin/` para os registros que estão no JSON — para mudar o
conteúdo de forma permanente, edite o JSON e rode o seed, ou pare de rodar o seed e passe a
editar só pelo admin. Nenhum dos dois apaga registros que não estão no JSON.

## 🧪 Testes

O backend tem uma suíte mínima cobrindo os endpoints da API (health, guides, projects, feedback e
rate limit) e os dois seeds. Roda com pytest + pytest-django, declarados em
`backend/requirements-dev.txt` — o `Dockerfile` recebe o arquivo a instalar via
`ARG REQUIREMENTS`, e o `docker-compose.yml` de dev passa `requirements-dev.txt` (o compose de
produção usa o padrão, `requirements.txt`, e não leva pytest para a imagem).

```bash
docker compose exec backend pytest
```

Os testes criam e destroem um banco próprio (`test_<POSTGRES_DB>`), não tocam nos dados de
desenvolvimento.

## 🚢 Deploy

O frontend segue no provedor estático de sempre (Vercel/Netlify). O backend roda em
`docker-compose.prod.yml` numa VM Oracle: Postgres + Gunicorn + Caddy (HTTPS automático via
Let's Encrypt). **Nunca use o `docker-compose.yml` da raiz em produção** — ele roda com
`runserver`, expõe o Postgres na porta `5432` e existe só para desenvolvimento local. Só o Caddy
expõe portas pro host (`80`/`443`); Postgres e o backend só são alcançáveis pela rede interna do
Docker.

### Testar localmente antes de ir pra VM

Se o stack de dev (`docker compose up`) já estiver rodando, use um nome de projeto diferente pro
teste do compose de produção, pra não colidir nomes de container/volume:

```bash
cp .env.production.example .env.production
```

Edite o `.env.production` gerado e troque `DOMAIN=api.lucasdaniel.dev.br` por `DOMAIN=localhost`
(sem isso o Caddy tenta emitir um certificado Let's Encrypt real, que falha sem DNS público
apontando pra sua máquina). Para `localhost`, o Caddy emite um certificado confiável localmente.

```bash
docker compose -p lucasdev-prod -f docker-compose.prod.yml up -d --build
```

```bash
docker compose -p lucasdev-prod -f docker-compose.prod.yml exec backend python manage.py migrate
```

```bash
docker compose -p lucasdev-prod -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

```bash
docker compose -p lucasdev-prod -f docker-compose.prod.yml exec backend python manage.py seed_guides
docker compose -p lucasdev-prod -f docker-compose.prod.yml exec backend python manage.py seed_projects
```

Acesse `https://localhost/api/health` e `https://localhost/admin/` (o navegador vai reclamar do
certificado local na primeira vez — é esperado, é auto-assinado pela CA interna do Caddy).

Pra derrubar o teste:

```bash
docker compose -p lucasdev-prod -f docker-compose.prod.yml down
```

### Deploy real na VM Oracle

1. Entrar na VM por SSH e instalar Docker + Docker Compose ([guia oficial](https://docs.docker.com/engine/install/ubuntu/)).
2. Clonar a branch de produção do repositório na VM.
3. Criar o `.env.production` de verdade:
   ```bash
   cp .env.production.example .env.production
   ```
   Preencher com valores reais: `SECRET_KEY` (gere um novo, não reaproveite o de dev),
   `POSTGRES_PASSWORD`, `ALLOWED_HOSTS`/`CORS_ALLOWED_ORIGINS`/`CSRF_TRUSTED_ORIGINS` com o domínio
   real, `DOMAIN=api.lucasdaniel.dev.br`, `BEHIND_REVERSE_PROXY=True`.
4. Na Oracle Cloud (regras de entrada da VCN), liberar só as portas `22` (SSH), `80` e `443`. A
   porta do Postgres (`5432`) não deve ser liberada — o `docker-compose.prod.yml` nem publica essa
   porta pro host, então nem adianta liberar.
5. Subir o stack:
   ```bash
   docker compose -f docker-compose.prod.yml up -d --build
   ```
6. Rodar as migrações, os seeds e criar o superusuário:
   ```bash
   docker compose -f docker-compose.prod.yml exec backend python manage.py migrate
   docker compose -f docker-compose.prod.yml exec backend python manage.py seed_guides
   docker compose -f docker-compose.prod.yml exec backend python manage.py seed_projects
   docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
   ```
7. Apontar o DNS de `api.lucasdaniel.dev.br` (registro A) para o IP público da VM. O Caddy só
   consegue emitir o certificado Let's Encrypt depois que isso propagar.
8. No provedor do frontend (Vercel), configurar `VITE_API_URL=https://api.lucasdaniel.dev.br`.
9. Só depois disso tudo validado, integrar o fluxo `dev → main → prod`.

### Hardening ainda pendente

Alguns pontos levantados numa revisão de segurança antes do primeiro deploy, pra tratar quando a
VM já estiver no ar (não bloqueiam o primeiro deploy, mas não devem ser esquecidos):

* Considerar `SECURE_HSTS_SECONDS` no Django uma vez que o HTTPS via Caddy estiver confirmado
  estável (não ativado por padrão aqui: é uma configuração "sem volta fácil" — o navegador guarda
  a política por muito tempo — não vale habilitar antes de confirmar que o domínio/certificado
  estão 100% estáveis).
* Senha forte de verdade pro superuser do `/admin/` — é o único endpoint de escrita de conteúdo e
  fica exposto na internet.
* Backups do Postgres (`pg_dump` agendado) — ainda não configurado.
