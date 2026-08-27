import type { AutomationExecution } from "./types";

export type ExecutionEvent = { executionId: string; tenantId: string; type: "STARTED" | "ACTION_STARTED" | "ACTION_COMPLETED" | "WAITING" | "FAILED" | "COMPLETED"; actionIndex?: number; data?: Record<string, unknown>; occurredAt: string };

export interface AutomationExecutionLedger {
  append(event: ExecutionEvent): Promise<void>;
  list(executionId: string, tenantId: string): Promise<ExecutionEvent[]>;
  get(executionId: string, tenantId: string): Promise<AutomationExecution | null>;
}
