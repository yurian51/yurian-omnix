import type { AIAgentDefinition } from "./ai-agent";
import { variableCatalog } from "./variable-catalog";

export function filterAgentContext(agent: AIAgentDefinition, context: Record<string, unknown>) {
  if (agent.tenantId !== String(context.tenantId ?? "")) throw new Error("Tenant mismatch");
  const catalog = new Set(variableCatalog.map((item) => item.path));
  const result: Record<string, unknown> = { tenantId: agent.tenantId };
  for (const path of agent.allowedVariables) {
    if (!catalog.has(path)) throw new Error(`Unknown agent variable: ${path}`);
    const value = path.split(".").reduce((current: any, key) => current == null ? undefined : current[key], context);
    if (value !== undefined) result[path] = value;
  }
  return result;
}
