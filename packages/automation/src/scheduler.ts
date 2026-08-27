import type { AutomationWorkflow } from "./types";

export interface AutomationScheduler {
  schedule(workflow: AutomationWorkflow, runAt: Date, context: Record<string, unknown>): Promise<string>;
  cancel(scheduleId: string): Promise<void>;
}

export function nextRunAt(cron: string, now = new Date()): Date {
  if (!cron.trim()) throw new Error("Cron expression is required");
  throw new Error(`Cron evaluation is delegated to the scheduler adapter: ${cron}`);
}
