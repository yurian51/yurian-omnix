export type ConversationContextInput = { tenantId: string; customer?: Record<string, unknown>; conversation?: Record<string, unknown>; message?: Record<string, unknown>; order?: Record<string, unknown>; payment?: Record<string, unknown>; ticket?: Record<string, unknown>; recentMessages?: Record<string, unknown>[]; memories?: Record<string, unknown>[] };

export type ConversationContext = ConversationContextInput & { builtAt: string };

export function buildConversationContext(input: ConversationContextInput, limits = { messages: 20, memories: 20 }): ConversationContext {
  if (!input.tenantId.trim()) throw new Error("Tenant context is required");
  return {
    ...input,
    recentMessages: (input.recentMessages ?? []).slice(-Math.max(0, limits.messages)),
    memories: (input.memories ?? []).slice(-Math.max(0, limits.memories)),
    builtAt: new Date().toISOString(),
  };
}
