# OMNIX Database Conventions

## Tenant isolation
All tenant-owned records carry `tenantId` directly or inherit ownership through a tenant-owned parent. Services must resolve the active tenant before querying or mutating tenant data.

## External identifiers
Provider IDs such as WABA IDs, phone number IDs, WhatsApp message IDs, group IDs and webhook event IDs are stored separately from OMNIX UUIDs.

## Financial values
Money uses PostgreSQL `numeric` via Prisma `Decimal`, never floating point.

## Idempotency
Webhook events are unique by `(provider, externalEventId)`. WhatsApp messages are unique by `(tenantId, whatsappMessageId)` when a provider message ID exists.

## Vector data
Knowledge and AI memory embeddings use PostgreSQL pgvector. The embedding dimension is currently 1536 and is isolated behind the AI/knowledge repositories so the model can be changed later without changing business-domain contracts.

## Auditability
Administrative, destructive, financial and other high-impact actions must create an `AuditLog` record with actor, resource and before/after state where applicable.

## Capability awareness
WhatsApp capabilities are stored per phone. Feature services must check capability state before attempting capability-specific operations.
