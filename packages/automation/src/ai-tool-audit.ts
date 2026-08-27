export type AIToolAuditEvent = { id: string; tenantId: string; executionId?: string; agentId: string; tool: string; args: Record<string, unknown>; outcome: "ALLOWED" | "DENIED" | "SUCCESS" | "FAILED" | "REQUIRES_APPROVAL"; reason?: string; occurredAt: string };

export interface AIToolAuditStore { append(event: AIToolAuditEvent): Promise<void>; list(tenantId: string, executionId?: string): Promise<AIToolAuditEvent[]>; }

export function createAIToolAuditEvent(input: Omit<AIToolAuditEvent, "id" | "occurredAt">): AIToolAuditEvent {
  return { ...input, id: `aitool_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`, occurredAt: new Date().toISOString() };
}
