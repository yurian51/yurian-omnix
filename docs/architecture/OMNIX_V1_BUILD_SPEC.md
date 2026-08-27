# YURIAN OMNIX V1 Build Specification

## Product
**YURIAN OMNIX** — AI-Powered WhatsApp Business Operating System.

## Core goals
- Multi-tenant SaaS for businesses using official WhatsApp Business Platform/Cloud API.
- Unified inbox with AI, human-agent handoff, CRM, sales/order management, support, campaigns, automations and analytics.
- Capability-aware WhatsApp integration so unsupported Meta capabilities are never presented as universally available.
- API-first, secure, observable and production-oriented architecture.

## Architecture
- Web: Next.js + TypeScript + Tailwind + shadcn/ui.
- API: NestJS + TypeScript.
- Worker: BullMQ processors backed by Redis.
- Database: PostgreSQL + Prisma.
- Vector search: pgvector.
- Realtime: WebSockets.
- Storage: S3-compatible object storage.
- Deployment: Docker + CI/CD.

## Repository structure
```text
apps/
  web/
  api/
  worker/
packages/
  database/ auth/ whatsapp/ ai/ bot-engine/ crm/ commerce/
  payments/ support/ groups/ campaigns/ automation/ analytics/
  queue/ storage/ validation/ types/ ui/ config/
prisma/
docs/
tests/
scripts/
docker/
```

## Core domains
- Tenant, User, Role, Permission
- WhatsAppAccount, WhatsAppPhone, WhatsAppCapability
- Contact, Conversation, Message
- Agent, Team, Ticket
- AI Agent, Memory, Knowledge Base, Document, Chunk
- BotFlow, BotNode, BotEdge, BotSession
- Product, Variant, Inventory, Cart, Order, Payment, Refund
- WhatsApp Group, Participant, Join Request
- Campaign, Audience, Automation, Execution
- WebhookEvent, API Key, AuditLog, Subscription

## Mandatory architectural rules
1. Every tenant-scoped resource is tenant-aware.
2. Never process webhook payloads synchronously beyond validation/persistence/queueing.
3. Incoming WhatsApp events must be idempotent by provider event/message identifiers.
4. Secrets are encrypted at rest and never committed to git.
5. AI can call only registered tools with explicit authorization and business rules.
6. High-impact actions require approval when configured.
7. All destructive/admin actions are auditable.
8. No fake analytics, placeholders or non-functional controls in production UI.
9. WhatsApp capabilities are discovered and checked before capability-specific operations.
10. Keep WhatsApp adapter interfaces independent from the OMNIX conversation/business core so future channels can be added.

## Primary queues
- whatsapp.incoming
- whatsapp.outgoing
- whatsapp.status
- webhook.processing
- ai.requests
- ai.embeddings
- ai.summaries
- bot.execution
- automation.execution
- campaign.dispatch
- campaign.retry
- payment.verification
- analytics.events
- omnix.dlq

## Primary API areas
```text
/api/v1/auth
/api/v1/tenant
/api/v1/whatsapp
/api/v1/conversations
/api/v1/contacts
/api/v1/ai
/api/v1/bots
/api/v1/products
/api/v1/orders
/api/v1/payments
/api/v1/support
/api/v1/groups
/api/v1/campaigns
/api/v1/automations
/api/v1/analytics
/api/v1/integrations
/api/v1/developer
/api/v1/webhooks/whatsapp
```

## Build order
1. Monorepo/tooling, Docker, config.
2. PostgreSQL/Prisma and migrations.
3. Authentication, tenancy, RBAC and team management.
4. WhatsApp Embedded Signup/account/phone/capability/webhook foundations.
5. Contacts, conversations, messages, realtime inbox and human handoff.
6. AI orchestrator, tool router, memory, knowledge base and RAG.
7. Bot/flow and automation engines.
8. Products, carts, orders, payments and support.
9. Groups, templates, flows and campaigns.
10. Analytics, developer API, billing, observability and production hardening.

## Definition of done
Every production feature requires UI, API, database, authorization, validation, error/loading/empty states, tests, auditability where relevant, responsive behavior, documentation and end-to-end verification.
