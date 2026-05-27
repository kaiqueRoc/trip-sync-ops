# trip-sync-ops

Console operacional **TripSync** — frontend de portfólio para integrações travel B2B (reservas, provedores REST/SOAP e fila de sync).

## Stack

- React 19 + Vite 8 + TypeScript
- TanStack Query (cache e mutations)
- React Hook Form + Zod (`@trip-sync/contracts`)
- Tipos OpenAPI gerados com `openapi-typescript`
- MSW para desenvolvimento offline / fallback quando a API não responde

## Pré-requisitos

- Node.js ≥ 20
- Repositórios irmãos clonados ao lado deste projeto:
  - `../trip-sync-contracts` (schemas Zod + `docs/openapi/openapi.json`)
  - `../trip-sync-api` (opcional em dev; porta **3333**)

```bash
# Contratos (obrigatório antes do build)
cd ../trip-sync-contracts && npm ci && npm run build

# API (opcional — sem ela o MSW fallback assume no dev)
cd ../trip-sync-api && npm ci && npm run dev
```

## Configuração

Copie `.env.example` para `.env`:

| Variável | Descrição |
|----------|-----------|
| `VITE_API_URL` | Base da API (padrão `http://localhost:3333` em dev e `/api` em produção, com rewrite para `trip-sync-api.vercel.app`) |
| `VITE_USE_MSW` | `true` força mocks MSW |
| `VITE_MSW_FALLBACK` | `true` (padrão em dev) ativa MSW se `/health` falhar |

O Vite também expõe proxy `/api` → `localhost:3333` (útil se você apontar o client para `/api`).

## Scripts

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # gera tipos OpenAPI + build de produção
npm run preview
npm run test
npm run lint
npm run api:types    # só regenera src/api/generated/schema.ts
```

## Rotas da aplicação

| Rota | Função |
|------|--------|
| `/` | Dashboard (saúde API, KPIs, últimas reservas) |
| `/bookings` | Lista, filtros e criação de reservas |
| `/bookings/:id` | Detalhe, atualização de status, enfileirar sync |
| `/providers` | Lista e cadastro de provedores |
| `/providers/:id` | Detalhe do provedor |
| `/sync-jobs` | Fila de sincronização |

## Arquitetura (src)

```
src/
  api/           # client fetch, queries TanStack, schema OpenAPI gerado
  components/    # layout + UI
  features/      # páginas por domínio
  mocks/         # MSW handlers + bootstrap
  config/        # env
```

Contratos compartilhados: `@trip-sync/contracts` (`file:../trip-sync-contracts`).

## CI

GitHub Actions (`.github/workflows/ci.yml`) instala dependências, compila contratos quando o checkout irmão existe, e executa `lint`, `test` e `build`.

## Licença

MIT — portfólio [Kaique Rocha](https://github.com/kaiqueRoc).
