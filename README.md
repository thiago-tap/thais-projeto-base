# Painel de Usuários

Projeto didático para aula: **Angular 22 + Tailwind 4 + NestJS 12**, com “banco de dados” em um arquivo JSON.

Objetivo da apresentação: mostrar o caminho completo

`tela → serviço → HTTP → controller → arquivo JSON`

sem PostgreSQL, Docker ou NgRx.

---

## Como subir (dois terminais)

### 1) API (porta 3000)

```bash
cd api
npm install
npm run start:dev
```

A API fica em `http://localhost:3000/api`.

### 2) Frontend (porta 4200)

```bash
cd frontend
npm install
npm start
```

O Angular usa `proxy.conf.json` para encaminhar `/api` → `http://localhost:3000`.

Abra: `http://localhost:4200`

### Testes da API

```bash
cd api
npm run test:e2e
```

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
