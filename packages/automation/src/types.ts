export type TriggerType = "EVENT" | "COMMAND" | "SCHEDULE" | "WEBHOOK";
export type ConditionOperator = "EQ" | "NEQ" | "CONTAINS" | "GT" | "GTE" | "LT" | "LTE" | "EXISTS";
export type ActionType = "SEND_WHATSAPP" | "RUN_COMMAND" | "RUN_AI" | "ASSIGN_AGENT" | "CREATE_TICKET" | "CREATE_ORDER" | "ADD_TAG" | "WAIT";
export type AutomationTrigger = { type: TriggerType; event?: string; command?: string; cron?: string; webhookKey?: string };
export type AutomationCondition = { field: string; operator: ConditionOperator; value?: unknown };
export type AutomationAction = { type: ActionType; config: Record<string, unknown> };
export type AutomationWorkflow = { id: string; tenantId: string; name: string; enabled: boolean; trigger: AutomationTrigger; conditions?: AutomationCondition[]; actions: AutomationAction[] };

export type AutomationExecutionStatus = "QUEUED" | "RUNNING" | "WAITING" | "COMPLETED" | "FAILED" | "CANCELLED";
export type AutomationExecution = { id: string; workflowId: string; tenantId: string; status: AutomationExecutionStatus; currentAction: number; context: Record<string, unknown>; error?: string; createdAt: string; updatedAt: string };

export interface AutomationExecutionStore {
  create(input: Omit<AutomationExecution, "createdAt" | "updatedAt">): Promise<AutomationExecution>;
  update(id: string, tenantId: string, patch: Partial<Pick<AutomationExecution, "status" | "currentAction" | "context" | "error">>): Promise<AutomationExecution>;
  get(id: string, tenantId: string): Promise<AutomationExecution | null>;
}
