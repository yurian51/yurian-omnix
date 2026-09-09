export type AgentRequest = {
  tenantId: string;
  agentId: string;
  conversationId: string;
  requestId: string;
  input: string;
};

export function validateAgentRequest(request: AgentRequest): void {
  for (const [key, value] of Object.entries(request)) {
    if (typeof value !== "string" || !value.trim()) {
      throw new Error(`${key} is required`);
    }
  }
}
