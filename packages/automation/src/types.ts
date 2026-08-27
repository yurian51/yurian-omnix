export type TriggerType = "EVENT" | "COMMAND" | "SCHEDULE" | "WEBHOOK";
export type ConditionOperator = "EQ" | "NEQ" | "CONTAINS" | "GT" | "GTE" | "LT" | "LTE" | "EXISTS";
export type ActionType = "SEND_WHATSAPP" | "RUN_COMMAND" | "RUN_AI" | "ASSIGN_AGENT" | "CREATE_TICKET" | "CREATE_ORDER" | "ADD_TAG" | "WAIT";
export type AutomationTrigger = { type: TriggerType; event?: string; command?: string; cron?: string; webhookKey?: string };
export type AutomationCondition = { field: string; operator: ConditionOperator; value?: unknown };
export type AutomationAction = { type: ActionType; config: Record<string, unknown> };
export type AutomationWorkflow = { id: string; tenantId: string; name: string; enabled: boolean; trigger: AutomationTrigger; conditions?: AutomationCondition[]; actions: AutomationAction[] };
