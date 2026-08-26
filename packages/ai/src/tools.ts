export type AIToolContext = {
  tenantId: string;
  conversationId: string;
  contactId: string;
};

export type AITool = {
  name: string;
  description: string;
  execute: (context: AIToolContext, args: Record<string, unknown>) => Promise<unknown>;
};

export const CORE_TOOL_NAMES = [
  "search_products",
  "get_product",
  "create_order",
  "get_order",
  "get_customer",
  "create_support_ticket",
  "handoff_to_agent",
] as const;

export type CoreToolName = (typeof CORE_TOOL_NAMES)[number];

export function createToolRegistry(tools: AITool[]): Map<string, AITool> {
  return new Map(tools.map((tool) => [tool.name, tool]));
}
