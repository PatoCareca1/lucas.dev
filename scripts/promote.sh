#!/usr/bin/env bash
#
# Promove código pela cadeia dev → main → prod.
#
# O que este script faz:
#   1. Valida que a árvore de trabalho está limpa e que as três branches estão
#      sincronizadas com o remoto (aborta se não estiverem — nunca faz reset).
#   2. Roda a validação completa em `dev`: lint + build do frontend, migrate +
#      seeds + pytest no backend, e um smoke test da API.
#   3. Faz o merge dev → main e main → prod, com `--no-ff` para deixar rastro.
#
# O que este script NÃO faz, deliberadamente:
#   * `git push` — quem publica é você. O script imprime os comandos no final.
#   * `git reset`/`--force` de qualquer tipo. Se algo estiver divergente, ele
#     para e explica, em vez de "consertar" reescrevendo história.
#
# Uso:
#   ./scripts/promote.sh              # validação completa + merges locais
#   ./scripts/promote.sh --check-only # só valida, não faz merge nenhum
#
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

CHECK_ONLY=false
[[ "${1:-}" == "--check-only" ]] && CHECK_ONLY=true

# Nome do projeto Compose usado só pela validação, para não colidir com o
# stack de dev que você talvez tenha rodando.
COMPOSE_PROJECT="lucasdev-promote"
COMPOSE="docker compose -p $COMPOSE_PROJECT"

info()  { printf '\n\033[1;34m▶ %s\033[0m\n' "$*"; }
ok()    { printf '\033[1;32m✓ %s\033[0m\n' "$*"; }
warn()  { printf '\033[1;33m! %s\033[0m\n' "$*"; }
die()   { printf '\n\033[1;31m✗ %s\033[0m\n' "$*" >&2; exit 1; }

cleanup() {
  if [[ "${STACK_UP:-false}" == "true" ]]; then
    info "Derrubando o stack de validação"
    $COMPOSE down -v >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT

# --------------------------------------------------------------------------
# 0. Pré-condições
# --------------------------------------------------------------------------

info "Checando pré-condições"

[[ -n "$(git status --porcelain)" ]] && \
  die "Árvore de trabalho suja. Commite ou guarde (stash) suas mudanças antes de promover."

command -v docker >/dev/null || die "docker não encontrado no PATH."
command -v npm    >/dev/null || die "npm não encontrado no PATH."

ORIGINAL_BRANCH="$(git rev-parse --abbrev-ref HEAD)"
[[ "$ORIGINAL_BRANCH" == "dev" ]] || \
  die "Rode a partir de 'dev' (você está em '$ORIGINAL_BRANCH')."

info "Buscando refs do remoto"
git fetch origin --prune

# As três branches precisam existir no remoto e estar alinhadas com o local.
# `prod` pode não existir localmente ainda — isso é tratado na etapa de merge.
for branch in dev main; do
  git show-ref --verify --quiet "refs/heads/$branch" || \
    die "Branch local '$branch' não existe. Crie com: git branch $branch origin/$branch"

  local_sha="$(git rev-parse "$branch")"
  remote_sha="$(git rev-parse "origin/$branch")"

  if [[ "$local_sha" != "$remote_sha" ]]; then
    ahead="$(git rev-list --count "origin/$branch..$branch")"
    behind="$(git rev-list --count "$branch..origin/$branch")"
    die "Branch '$branch' divergiu de origin/$branch (${ahead} à frente, ${behind} atrás).
     Sincronize antes de promover. Se '$branch' não tem trabalho local só seu:
       git checkout $branch && git merge --ff-only origin/$branch && git checkout dev"
  fi
done

ok "Árvore limpa, branches sincronizadas com o remoto"

# --------------------------------------------------------------------------
# 1. Frontend: lint + build
# --------------------------------------------------------------------------

info "Frontend — instalando dependências (npm ci)"
npm ci --prefix frontend

info "Frontend — lint"
npm run lint --prefix frontend

info "Frontend — build (tsc -b && vite build)"
npm run build --prefix frontend

ok "Frontend validado"

# --------------------------------------------------------------------------
# 2. Backend: stack de dev + migrate + seeds + pytest
# --------------------------------------------------------------------------

[[ -f backend/.env ]] || \
  die "backend/.env não existe. Crie com: cp backend/.env.example backend/.env (e preencha)."

info "Backend — subindo Postgres + Django"
$COMPOSE up -d --build
STACK_UP=true

info "Backend — aguardando o Postgres ficar saudável"
for _ in $(seq 1 30); do
  if $COMPOSE exec -T db pg_isready -q 2>/dev/null; then break; fi
  sleep 2
done
$COMPOSE exec -T db pg_isready -q || die "Postgres não ficou pronto a tempo."

info "Backend — migrate"
$COMPOSE exec -T backend python manage.py migrate --noinput

info "Backend — seeds"
$COMPOSE exec -T backend python manage.py seed_guides
$COMPOSE exec -T backend python manage.py seed_projects

info "Backend — pytest"
$COMPOSE exec -T backend pytest

ok "Backend validado"

# --------------------------------------------------------------------------
# 3. Smoke test da API
# --------------------------------------------------------------------------

info "Smoke test — batendo nos endpoints reais"

smoke() {
  local path="$1" expected="$2"
  local code
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:8000${path}")"
  [[ "$code" == "$expected" ]] || die "GET $path devolveu $code, esperava $expected"
  printf '  %-28s → %s\n' "$path" "$code"
}

# O runserver pode levar um instante a mais que o container para atender.
for _ in $(seq 1 15); do
  curl -sf -o /dev/null http://localhost:8000/api/health && break
  sleep 2
done

smoke "/api/health"          200
smoke "/api/guides"          200
smoke "/api/projects"        200
smoke "/api/guides/nao-existe" 404

ok "Smoke test passou"

if [[ "$CHECK_ONLY" == "true" ]]; then
  info "--check-only: validação concluída, nenhum merge feito."
  exit 0
fi

# --------------------------------------------------------------------------
# 4. Merges: dev → main → prod
# --------------------------------------------------------------------------

cleanup
STACK_UP=false

promote() {
  local from="$1" to="$2"

  info "Merge $from → $to"

  if ! git show-ref --verify --quiet "refs/heads/$to"; then
    warn "Branch local '$to' não existe — criando a partir de origin/$to"
    git branch "$to" "origin/$to"
  fi

  git checkout "$to"

  if git merge-base --is-ancestor "$from" "$to"; then
    ok "'$to' já contém tudo de '$from' — nada a fazer"
    return
  fi

  git merge --no-ff "$from" -m "Merge branch '$from' into $to"
  ok "$from → $to concluído"
}

promote dev main
promote main prod

git checkout "$ORIGINAL_BRANCH"

# --------------------------------------------------------------------------
# 5. Fim — o push é seu
# --------------------------------------------------------------------------

info "Merges locais concluídos. Nada foi enviado ao remoto."

cat <<'EOF'

Revise o resultado antes de publicar:

  git log --oneline --graph --decorate dev main prod | head -30
  git diff origin/main..main
  git diff origin/prod..prod

Quando estiver satisfeito, publique você mesmo:

  git push origin main
  git push origin prod

EOF
