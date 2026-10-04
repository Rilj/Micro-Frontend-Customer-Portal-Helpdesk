# AGENTS.md - Development Guide

## Project Overview
This is a monorepo for an **Enterprise Micro-Frontend Customer Portal & Helpdesk**.
- **Monorepo tools:** pnpm workspaces + Turborepo
- **Frontend:** React 18 + TypeScript + Vite
- **Micro-Frontend runtime:** Vite Module Federation
- **Backend:** NestJS (auth), Go/Gin (tickets), Node.js/Socket.io (chat), Node/Express (KB)
- **Database:** PostgreSQL
- **Testing:** Vitest (unit), Playwright (E2E)

## Commands

### Common Development
```bash
pnpm install          # Install all dependencies
pnpm dev              # Start all services (use --filter for specific)
pnpm build            # Build all packages
pnpm test             # Run all unit tests
pnpm lint             # Lint all code
pnpm typecheck        # TypeScript type checking
pnpm clean            # Clean all build artifacts
```

### Per-Package Commands
```bash
pnpm --filter shell-host dev      # Start shell host only
pnpm --filter remote-auth test    # Test auth remote
pnpm --filter auth-service build  # Build auth service
pnpm --filter @mf-enterprise/event-bus test  # Test shared event-bus
```

### Docker
```bash
pnpm docker:up      # Start all infrastructure
pnpm docker:down    # Stop all infrastructure
pnpm docker:logs    # View all logs
```

## Project Structure
```
apps/                  # Micro-frontend applications
  shell-host/          # Host/Shell App (port 3000)
  remote-auth/         # Auth Remote (port 3003)
  remote-ticketing/    # Ticketing Remote (port 3001)
  remote-chat/         # Chat Remote (port 3002)
  remote-knowledgebase/ # KB Remote (port 3004)

packages/              # Shared packages
  ui-components/       # Design system
  event-bus/           # Cross-app event bus
  ts-config/           # Shared TS configs
  eslint-config/       # Shared ESLint rules

services/              # Backend microservices
  auth-service/        # Auth (NestJS, port 8000)
  ticket-service/      # Tickets (Go/Gin, port 8001)
  chat-service/        # Chat (Socket.io, port 8002)
  knowledge-service/   # KB (Express, port 8003)

shared/types/          # Shared TypeScript types
tests/e2e/             # E2E tests (Playwright)
```

## Module Federation Remotes
- `authApp` → http://localhost:3003/assets/remoteEntry.js
- `ticketingApp` → http://localhost:3001/assets/remoteEntry.js
- `chatApp` → http://localhost:3002/assets/remoteEntry.js
- `kbApp` → http://localhost:3004/assets/remoteEntry.js

## API Endpoints
- Auth: `http://localhost:8000/api`
- Tickets: `http://localhost:8001/api`
- Chat: WebSocket `http://localhost:8002`
- KB: `http://localhost:8003/api`

## Coding Standards
- TypeScript strict mode
- Prettier formatting (2-space indent)
- Vitest for unit tests
- Playwright for E2E tests
- ESLint with shared config

<!-- BEGIN:turborepo-agent-rules -->

# This is NOT the Turborepo you know

Turborepo configuration, task behavior, and CLI commands can vary between installed versions and may differ from your training data. Resolve the `turbo` package from this file's directory or relevant workspace; in monorepos, it may not be visible from the repository root. For example, run `node -p "require.resolve('turbo/package.json')"` from a workspace that depends on `turbo`.

Read `docs/README.md` inside that installed package first, then read the relevant pages from its `docs/` directory before changing Turborepo configuration or commands. Heed deprecation notices. These bundled docs match the installed package version and are available without network access.

This block is written and re-added by `turbo` before repository-scoped commands when an AI agent is detected. In the Turborepo source repository, its template is defined in `crates/turborepo-cli/src/cli/agent_guidance.rs`. Removing the managed block while updates are enabled means a later qualifying invocation will add it again. Set `"agentGuidance": false` in the root `turbo.json` or `turbo.jsonc` to opt out; this does not remove an existing block. Keep the block committed with your work to avoid an uncommitted change on the next agent invocation.
<!-- END:turborepo-agent-rules -->
