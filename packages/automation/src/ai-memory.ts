export type MemoryKind = "FACT" | "PREFERENCE" | "SUMMARY" | "CONVERSATION";
export type AgentMemory = { id: string; tenantId: string; customerId: string; kind: MemoryKind; key: string; value: string; source?: string; createdAt: string; updatedAt: string };

export interface AgentMemoryStore {
  list(tenantId: string, customerId: string, limit?: number): Promise<AgentMemory[]>;
  upsert(memory: AgentMemory): Promise<AgentMemory>;
  delete(id: string, tenantId: string): Promise<void>;
}

export function buildMemoryContext(memories: AgentMemory[], maxItems = 20) {
  return memories.filter((memory) => memory.tenantId).slice(0, Math.max(0, maxItems)).map(({ kind, key, value, source }) => ({ kind, key, value, source }));
}
