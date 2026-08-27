import type { ToolHandler } from "./ai-tool-gateway";
import { AIToolGateway } from "./ai-tool-gateway";

export function createAIGateway(handlers: Record<string, ToolHandler>) {
  return new AIToolGateway(handlers);
}

export function mergeToolHandlers(...sets: Record<string, ToolHandler>[]) {
  return Object.assign({}, ...sets);
}
