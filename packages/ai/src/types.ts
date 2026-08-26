export type ConversationMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

export type CustomerContext = {
  contactId: string;
  name?: string;
  phone: string;
  lifecycle: string;
  tags: string[];
  memory: string[];
};

export type KnowledgeContext = {
  title: string;
  content: string;
  sourceId: string;
  score: number;
};

export type AIOrchestratorRequest = {
  tenantId: string;
  conversationId: string;
  messageId: string;
  agentId: string;
  customer: CustomerContext;
  history: ConversationMessage[];
  knowledge: KnowledgeContext[];
  input: string;
};

export type AIAction =
  | { type: "reply"; content: string }
  | { type: "tool_call"; tool: string; arguments: Record<string, unknown> }
  | { type: "handoff"; reason: string };

export type AIOrchestratorResult = {
  action: AIAction;
  confidence: number;
};
