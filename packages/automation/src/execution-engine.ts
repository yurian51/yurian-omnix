import type { AutomationAction, AutomationExecution, AutomationExecutionStore, AutomationWorkflow } from "./types";

export interface AutomationActionDispatcher {
  dispatch(action: AutomationAction, context: Record<string, unknown>): Promise<unknown>;
}

export class ResumableAutomationEngine {
  constructor(private readonly executions: AutomationExecutionStore, private readonly dispatcher: AutomationActionDispatcher) {}

  async start(workflow: AutomationWorkflow, context: Record<string, unknown>) {
    if (workflow.tenantId !== String(context.tenantId ?? "")) throw new Error("Tenant mismatch");
    const execution = await this.executions.create({
      id: `${workflow.id}:${Date.now()}:${Math.random().toString(36).slice(2, 10)}`,
      workflowId: workflow.id,
      tenantId: workflow.tenantId,
      status: "QUEUED",
      currentAction: 0,
      context,
    });
    return this.resume(workflow, execution);
  }

  async resume(workflow: AutomationWorkflow, execution: AutomationExecution) {
    if (workflow.tenantId !== execution.tenantId) throw new Error("Tenant mismatch");
    await this.executions.update(execution.id, execution.tenantId, { status: "RUNNING" });
    let index = execution.currentAction;
    let context = execution.context;
    try {
      for (; index < workflow.actions.length; index += 1) {
        const action = workflow.actions[index];
        if (action.type === "WAIT") {
          await this.executions.update(execution.id, execution.tenantId, { status: "WAITING", currentAction: index, context });
          return { status: "WAITING" as const, executionId: execution.id, resumeAt: new Date(Date.now() + Math.min(Math.max(Number(action.config.ms ?? 0), 0), 86_400_000)).toISOString() };
        }
        const result = await this.dispatcher.dispatch(action, context);
        context = { ...context, lastActionResult: result };
        await this.executions.update(execution.id, execution.tenantId, { status: "RUNNING", currentAction: index + 1, context });
      }
      return await this.executions.update(execution.id, execution.tenantId, { status: "COMPLETED", currentAction: workflow.actions.length, context });
    } catch (error) {
      return this.executions.update(execution.id, execution.tenantId, { status: "FAILED", currentAction: index, context, error: error instanceof Error ? error.message : String(error) });
    }
  }
}
