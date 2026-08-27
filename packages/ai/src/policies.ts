export type ToolRisk = "read" | "write" | "financial" | "external";

export type ToolPolicy = {
  name: string;
  risk: ToolRisk;
  requiresApproval: boolean;
};

export const DEFAULT_TOOL_POLICIES: ToolPolicy[] = [
  { name: "search_products", risk: "read", requiresApproval: false },
  { name: "get_product", risk: "read", requiresApproval: false },
  { name: "get_customer", risk: "read", requiresApproval: false },
  { name: "get_order", risk: "read", requiresApproval: false },
  { name: "create_support_ticket", risk: "write", requiresApproval: false },
  { name: "create_order", risk: "financial", requiresApproval: true },
  { name: "handoff_to_agent", risk: "external", requiresApproval: false },
];

export function requiresToolApproval(toolName: string, policies = DEFAULT_TOOL_POLICIES): boolean {
  return policies.find((policy) => policy.name === toolName)?.requiresApproval ?? true;
}
