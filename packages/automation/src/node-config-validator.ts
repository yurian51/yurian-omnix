import type { WorkflowNode } from "./workflow-graph";
import { nodeConfigSchemas } from "./node-config-schema";

export function validateNodeConfig(node: WorkflowNode) {
  const schema = nodeConfigSchemas[node.type];
  if (!schema) throw new Error(`No config schema for ${node.type}`);
  for (const field of schema) {
    const value = node.config[field.key];
    if (field.required && (value === undefined || value === null || value === "")) throw new Error(`${node.type}.${field.key} is required`);
    if (field.type === "NUMBER" && value !== undefined && !Number.isFinite(Number(value))) throw new Error(`${node.type}.${field.key} must be a number`);
    if (field.type === "SELECT" && value !== undefined && field.options && !field.options.some((option) => option.value === value)) throw new Error(`Invalid ${node.type}.${field.key}`);
  }
  return node;
}
