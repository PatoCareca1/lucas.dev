# Runbook de Deploy — lucasdaniel.dev.br

Passo a passo do primeiro deploy do backend na VM Oracle, saindo de um front-only
para **frontend na Vercel (Vite) + backend na Oracle**.

O `README.md` documenta *como o projeto funciona*. Este runbook é a *ordem de
execução* de uma migração que só acontece uma vez, com as armadilhas que a
documentação normal não cobre.

---

## ⚠️ A ordem importa: DNS **antes** do Compose

O `README.md` (passo 7 da seção "Deploy real na VM Oracle") lista o DNS *depois*
de subir o stack. **Faça o contrário.**

Assim que o `caddy` sobe com `DOMAIN=api.lucasdaniel.dev.br`, ele tenta emitir o
certificado Let's Encrypt imediatamente. Sem o registro A propagado, a validação
falha — e a Let's Encrypt limita a **5 falhas de validação por hostname por
hora**. Algumas tentativas de `up -d --build` enquanto o DNS não propagou e você
fica travado esperando a janela reabrir, com o domínio sem HTTPS.

Ordem correta: **DNS → propagar → só então subir o Compose.**

---

## 1. DNS (fazer primeiro, esperar propagar)

No provedor do domínio, criar o registro:

| Tipo | Nome  | Valor              | TTL  |
| ---- | ----- | ------------------ | ---- |
| A    | `api` | `<IP público da VM>` | 300  |

Confirmar a propagação antes de seguir:

```bash
dig +short api.lucasdaniel.dev.br
```

Só avance quando isso devolver o IP da VM. Se você tem o `.env.production` com
`DOMAIN` real, **não suba o Compose antes deste passo**.

---

## 2. Firewall da Oracle

Duas camadas, e esquecer a segunda é o motivo nº 1 de "subiu mas não responde":

1. **VCN / Security List** (console da Oracle): liberar ingress `22`, `80`, `443`.
2. **iptables da própria VM** — as imagens Ubuntu da Oracle vêm com regras
   restritivas por padrão:

```bash
sudo iptables -I INPUT -p tcp --dport 80  -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo netfilter-persistent save
```

Não libere `5432`. O `docker-compose.prod.yml` nem publica essa porta pro host.

---

## 3. VM: Docker + código

```bash
ssh ubuntu@<IP-da-VM>
```

Docker Engine + plugin do Compose ([guia oficial](https://docs.docker.com/engine/install/ubuntu/)),
depois clonar a branch de produção:

```bash
git clone -b prod https://github.com/PatoCareca1/<repo>.git lucas.dev
cd lucas.dev
```

---

## 4. `.env.production`

```bash
cp .env.production.example .env.production
```

Preencher com valores **reais** (o arquivo é git-ignored — nunca commitar):

| Variável | Valor |
| --- | --- |
| `SECRET_KEY` | Gere um novo, não reaproveite o de dev |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `api.lucasdaniel.dev.br` |
| `CORS_ALLOWED_ORIGINS` | `https://lucasdaniel.dev.br,https://www.lucasdaniel.dev.br` |
| `CSRF_TRUSTED_ORIGINS` | `https://api.lucasdaniel.dev.br` |
| `BEHIND_REVERSE_PROXY` | `True` |
| `POSTGRES_PASSWORD` | Senha forte, gerada |
| `DOMAIN` | `api.lucasdaniel.dev.br` |

Gerar a `SECRET_KEY`:

```bash
python3 -c 'import secrets; print(secrets.token_urlsafe(50))'
```

`CORS_ALLOWED_ORIGINS` é a origem do **frontend** (Vercel); `CSRF_TRUSTED_ORIGINS`
é a do **backend**. Trocar as duas é um erro fácil e o sintoma é CORS bloqueado
no navegador com a API respondendo normalmente no `curl`.

---

## 5. Subir o stack

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Acompanhar a emissão do certificado:

```bash
docker compose -f docker-compose.prod.yml logs -f caddy
```

Você quer ver `certificate obtained successfully`. Se aparecer erro de
validação, **pare** — não fique repetindo `up`. Confira o DNS (passo 1) e o
firewall (passo 2) antes de tentar de novo, por causa do rate limit.

---

## 6. Migrate, seeds, superusuário

```bash
docker compose -f docker-compose.prod.yml exec backend python manage.py migrate
docker compose -f docker-compose.prod.yml exec backend python manage.py seed_guides
docker compose -f docker-compose.prod.yml exec backend python manage.py seed_projects
docker compose -f docker-compose.prod.yml exec backend python manage.py createsuperuser
```

O `/admin/` é o único endpoint de escrita exposto na internet — senha forte de
verdade, gerada, não reaproveitada.

Os seeds são idempotentes (`update_or_create`), mas **sobrescrevem** edições
feitas pelo `/admin/` nos registros que estão no JSON. Depois deste deploy,
escolha um dos dois caminhos: editar o JSON e re-rodar o seed, ou editar só pelo
admin e parar de rodar o seed.

---

## 7. Vercel

Em Settings → Environment Variables:

```
VITE_API_URL=https://api.lucasdaniel.dev.br
```

**O Vite injeta variáveis em build-time, não em runtime.** Salvar a variável não
muda nada no site que já está no ar — é obrigatório um **redeploy sem cache**
(Deployments → ⋯ → Redeploy → desmarcar "Use existing Build Cache"). Sem isso o
bundle continua apontando pro `localhost:8000` do `.env.development`.

---

## 8. Validação final

Da sua máquina, não da VM:

```bash
# API viva, via HTTPS real
curl -i https://api.lucasdaniel.dev.br/api/health

# Conteúdo seedado
curl -s https://api.lucasdaniel.dev.br/api/guides   | head -c 300
curl -s https://api.lucasdaniel.dev.br/api/projects | head -c 300

# HTTP redireciona pra HTTPS (Caddy faz isso sozinho)
curl -sI http://api.lucasdaniel.dev.br/api/health | head -3

# Certificado válido e emissor correto
echo | openssl s_client -connect api.lucasdaniel.dev.br:443 \
  -servername api.lucasdaniel.dev.br 2>/dev/null | openssl x509 -noout -issuer -dates
```

Checklist:

- [ ] `/api/health` responde `200` via HTTPS
- [ ] `/api/guides` e `/api/projects` devolvem os dados seedados
- [ ] HTTP redireciona pra HTTPS
- [ ] Certificado emitido pela Let's Encrypt, dentro da validade
- [ ] `/admin/` abre com CSS (confirma que o `collectstatic` do entrypoint rodou)
- [ ] Login no `/admin/` funciona
- [ ] Rate limit do feedback ativo: 11 POSTs seguidos em
      `/api/guides/<slug>/feedback` → o 11º devolve `429`
- [ ] Frontend na Vercel carrega guides/projects da API real
      (DevTools → Network → as chamadas vão pra `api.lucasdaniel.dev.br`, não `localhost`)
- [ ] Sem erro de CORS no console do navegador

---

## Rollback

Se algo der errado depois do deploy:

```bash
# Derrubar mantendo os dados (o volume do Postgres sobrevive)
docker compose -f docker-compose.prod.yml down

# Voltar pro commit anterior de prod e subir de novo
git checkout <sha-anterior>
docker compose -f docker-compose.prod.yml up -d --build
```

**Nunca** use `down -v` em produção — o `-v` apaga o volume `lucasdev_prod_db_data`,
ou seja, o banco inteiro.

---

## Pendências conhecidas (não bloqueiam o deploy)

* **Backups do Postgres** — nada configurado ainda. Antes de o conteúdo virar
  algo que você não queira reescrever, agendar um `pg_dump`.
* **`SECURE_HSTS_SECONDS`** — só depois de o HTTPS estar comprovadamente estável.
  É uma configuração sem volta fácil: o navegador guarda a política por muito tempo.
* **Commits "Unverified" no GitHub** — falta assinatura SSH/GPG.
* **`dev.log` versionado na raiz** — deveria estar no `.gitignore`.
* **`DeprecationWarning` do django-ninja** em [backend/guides/api.py:45](backend/guides/api.py#L45)
  — `return 201, {...}` deve virar `return Status(201, {...})` na v1.
