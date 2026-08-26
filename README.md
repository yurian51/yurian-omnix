# YURIAN OMNIX

> **AI-Powered WhatsApp Business Operating System**
>
> One WhatsApp. One AI. One Business Operating System.

OMNIX is a production-oriented, multi-tenant SaaS platform for businesses operating on WhatsApp. It combines WhatsApp Business Platform integration, AI, unified conversations, CRM, sales/orders, payments, customer support, groups, campaigns, automation and analytics behind one business operating system.

## Product pillars

- WhatsApp Business Platform / Cloud API integration
- AI assistant, specialist agents, tools, memory and RAG
- Unified inbox with AI, human and hybrid modes
- CRM and Customer 360
- Products, carts, orders and payments
- Support tickets and agent routing
- Capability-aware WhatsApp group operations
- Campaigns and message templates
- Visual bot and automation engine
- Analytics, audit logs and developer APIs
- Multi-tenant isolation and RBAC

## Engineering principles

- Production first
- API first
- Multi-tenant first
- Security first
- AI native
- Automation first
- No fake data or non-functional controls
- Idempotent webhook/event processing
- Explicit authorization for AI tools and high-impact actions

## Repository layout

```text
apps/
  web/       # Next.js dashboard
  api/       # NestJS API
  worker/    # BullMQ workers
packages/    # shared domain packages
prisma/      # schema + migrations
docs/        # architecture and implementation docs
tests/       # cross-app and E2E tests
docker/      # local/production container assets
```

## Current status

**Foundation phase**

The repository is intentionally starting clean. The implementation specification lives in `docs/architecture/OMNIX_V1_BUILD_SPEC.md`.

## Planned stack

- Next.js + TypeScript + Tailwind + shadcn/ui
- NestJS + TypeScript
- PostgreSQL + Prisma
- Redis + BullMQ
- pgvector
- WebSockets
- S3-compatible object storage
- Docker + CI/CD

## Security

Never commit secrets, access tokens, provider credentials or production environment files. Use `.env.example` for documentation only and secret management in deployment environments.

## License

Proprietary. All rights reserved.
