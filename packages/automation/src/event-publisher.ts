import type { AutomationEvent } from "./event-bus";
import { AutomationEventBus } from "./event-bus";
import type { AutomationEventType } from "./events";

export class AutomationEventPublisher {
  constructor(private readonly bus: AutomationEventBus) {}

  publish(input: { id: string; tenantId: string; type: AutomationEventType; payload: Record<string, unknown>; occurredAt?: string }) {
    if (!input.id.trim() || !input.tenantId.trim()) throw new Error("Event id and tenantId are required");
    const event: AutomationEvent = { ...input, occurredAt: input.occurredAt ?? new Date().toISOString() };
    return this.bus.publish(event);
  }
}
