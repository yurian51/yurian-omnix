import type { AutomationWorkflow } from "./types";
import { AutomationEngine } from "./engine";

export type AutomationEvent = { id: string; tenantId: string; type: string; payload: Record<string, unknown>; occurredAt: string };

export class AutomationEventBus {
  constructor(private readonly engine: AutomationEngine, private readonly workflows: () => Promise<AutomationWorkflow[]>) {}

  async publish(event: AutomationEvent) {
    const workflows = await this.workflows();
    const matching = workflows.filter((workflow) => workflow.tenantId === event.tenantId && workflow.enabled && workflow.trigger.type === "EVENT" && workflow.trigger.event === event.type);
    const results = [];
    for (const workflow of matching) results.push(await this.engine.trigger(workflow, { tenantId: event.tenantId, event }));
    return { eventId: event.id, triggered: matching.length, results };
  }
}
