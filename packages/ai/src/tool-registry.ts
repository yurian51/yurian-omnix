import type { AITool } from "./tools";

export class AIToolRegistry {
  private readonly tools = new Map<string, AITool>();

  constructor(tools: AITool[] = []) {
    for (const tool of tools) this.register(tool);
  }

  register(tool: AITool) {
    if (!tool.name.trim()) throw new Error("Tool name is required");
    if (this.tools.has(tool.name)) throw new Error(`Tool already registered: ${tool.name}`);
    this.tools.set(tool.name, tool);
  }

  get(name: string) {
    return this.tools.get(name);
  }

  list() {
    return [...this.tools.values()];
  }
}
