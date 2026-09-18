# Painel de Usuários

Projeto didático para aula: **Angular 22 + Tailwind 4 + NestJS 12**, com “banco de dados” em um arquivo JSON.

Objetivo da apresentação: mostrar o caminho completo

`tela → serviço → HTTP → controller → arquivo JSON`

sem PostgreSQL, Docker ou NgRx.

---

## Como subir

Na raiz do projeto (um terminal só):

```bash
git clone https://github.com/thiago-tap/thais-projeto-base.git
cd thais-projeto-base
npm install
npm start
```

- `npm install` — instala a raiz **e** as pastas `api` + `frontend`
- `npm start` — sobe API (`:3000`) e Angular (`:4200`) juntos

Abra: `http://localhost:4200`

### Comandos úteis na raiz

| Comando | O que faz |
|---------|-----------|
| `npm install` | Instala tudo (raiz + api + frontend) |
| `npm start` / `npm run dev` | Sobe API e frontend juntos |
| `npm run build` | Build da API e do frontend |
| `npm run test:api` | Testes e2e da API |

### Alternativa (dois terminais)

```bash
# Terminal 1
cd api && npm install && npm run start:dev

# Terminal 2
cd frontend && npm install && npm start
```

O Angular usa `proxy.conf.json` para encaminhar `/api` → `http://localhost:3000`.

---

## Login de demonstração

| Campo  | Valor               |
|--------|---------------------|
| E-mail | `admin@sistema.com` |
| Senha  | `admin123`          |

A senha **não** fica em texto no arquivo: só o hash bcrypt em `api/dados/banco.json`.

---

## Telas

1. **Login** (`/login`) — pública
2. **Início** (`/inicio`) — dashboard com totais e atalhos
3. **Buscar usuários** (`/usuarios`) — filtros, editar/excluir com modal reutilizável
4. **Cadastrar / Editar** — formulários centralizados
5. **Perfil** (`/conta/perfil`) — dados da conta logada
6. **Trocar senha** (`/conta/senha`)
7. **Sobre** (`/sobre`) — roteiro das camadas da aula
8. **404** — rota desconhecida

Layout: componentes separados `Cabecalho` + `Rodape` + `ModalConfirmacao`.
Ícones: Lucide via `@ng-icons`.

---

## Endpoints da API

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/login` | não | Login → `{ token, usuario }` |
| POST | `/api/auth/trocar-senha` | sim | Troca senha do logado |
| GET | `/api/usuarios?busca=&perfil=&ordenar=` | sim | Lista / filtra / ordena |
| GET | `/api/usuarios/:id` | sim | Detalhe |
| POST | `/api/usuarios` | sim | Cadastro (e-mail único) |
| PUT | `/api/usuarios/:id` | sim | Edição (senha opcional) |
| DELETE | `/api/usuarios/:id` | sim | Exclusão (bloqueia autoexclusão) |

Cada usuário no JSON tem `criadoEm` e `atualizadoEm` (auditoria leve).

---

## Roteiro da aula (15–20 min)

Use os comentários `Camada N` no código:

1. **Camada 0** — modelo com auditoria (`criadoEm` / `atualizadoEm`)
2. **Camada 1** — `ArquivoBancoService` (ler, adicionar, atualizar, remover)
3. **Camada 2** — login JWT + trocar senha + `JwtAuthGuard`
4. **Camada 3** — CRUD de usuários + filtros na query
5. **Camada 4** — interceptor: Bearer + logout em 401
6. **Camada 5** — `authGuard` nas rotas do painel
7. **UX** — toast, skeleton, modal de exclusão, página 404

Na demo ao vivo:

- login inválido → erro
- login ok → lista com datas
- filtrar por perfil / ordenar Z–A
- cadastrar → toast + aparece no JSON
- editar → `atualizadoEm` muda
- tentar excluir a própria conta → bloqueado
- excluir outro → some da lista
- trocar senha → entrar de novo com a nova
- rota inventada → 404

---

## Estrutura

```
ThaisProjetoBase/
├── api/
│   ├── dados/banco.json
│   ├── src/auth|banco|usuarios|comum
│   └── test/painel.e2e-spec.ts
├── frontend/
│   └── src/app/
│       ├── comum/          # toast, formatadores
│       ├── paginas/        # login, busca, cadastro, editar, senha, 404
│       ├── servicos/
│       ├── guards/
│       └── interceptors/
└── README.md
```

---

## O que NÃO entrou (de propósito)

Passport, refresh token, RBAC real, paginação server-side, CSV, Material, Postgres, Docker, NgRx, CI.
