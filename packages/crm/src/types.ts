export type Customer = { id: string; tenantId: string; name: string; phone?: string; email?: string; status: "ACTIVE" | "BLOCKED" | "ARCHIVED"; createdAt: string; updatedAt: string };
export type CustomerTag = { id: string; tenantId: string; customerId: string; name: string };
export type CustomerNote = { id: string; tenantId: string; customerId: string; body: string; authorId: string; createdAt: string };
export type CustomerTimelineEvent = { id: string; tenantId: string; customerId: string; type: "MESSAGE" | "ORDER" | "PAYMENT" | "TICKET" | "NOTE" | "TAG"; referenceId?: string; occurredAt: string; metadata?: Record<string, unknown> };
