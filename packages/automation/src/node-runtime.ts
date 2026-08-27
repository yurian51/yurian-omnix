import type { WorkflowNode } from "./workflow-graph";

export type WorkflowNodeContext = { tenantId: string; executionId?: string; data: Record<string, unknown> };
export interface WorkflowNodeHandler { execute(node: WorkflowNode, context: WorkflowNodeContext): Promise<Record<string, unknown>>; }

export class WorkflowNodeRuntime {
  constructor(private readonly handlers: Partial<Record<WorkflowNode["type"], WorkflowNodeHandler>>) {}

  async execute(node: WorkflowNode, context: WorkflowNodeContext) {
    if (!context.tenantId) throw new Error("Tenant context is required");
    const handler = this.handlers[node.type];
    if (!handler) throw new Error(`No runtime handler registered for ${node.type}`);
    return handler.execute(node, context);
  }
}
