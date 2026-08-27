# OMNIX Architecture Decisions

## ADR-001: Modular monolith first

Start as a modular monolith plus background workers. Keep domain boundaries and package interfaces clean so selected domains can become separate services later without rewriting the product.

## ADR-002: Official WhatsApp Business Platform

Use the official Meta WhatsApp Business Platform / Cloud API as the primary WhatsApp integration. Do not make browser/session automation a production dependency.

## ADR-003: Capability-aware WhatsApp integration

Never assume a WhatsApp account has every API capability. Discover capabilities and guard each operation before execution.

## ADR-004: Tenant isolation by design

All tenant-owned records carry tenant scope and every repository/service authorization path must enforce tenant ownership.

## ADR-005: Async webhook processing

Webhook endpoints validate, persist and enqueue events, then return quickly. Workers handle business logic and outbound messaging.

## ADR-006: AI through tools

AI uses an allow-listed tool registry. Tools enforce authentication, tenant scope, permissions and business rules before side effects.

## ADR-007: Approval for high-impact actions

Refunds, destructive group actions, bulk campaigns and other configured high-impact operations can require explicit human approval.

## ADR-008: Channel-independent core

The conversation/business core must not depend directly on WhatsApp APIs. WhatsApp is an adapter. This permits future Instagram, Messenger, SMS, webchat and email adapters.
