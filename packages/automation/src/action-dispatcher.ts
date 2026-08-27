import type { AutomationAction } from "./types";

export interface AutomationActionHandlers {
  sendWhatsApp?: (config: Record<string, unknown>, context: Record<string, unknown>) => Promise<unknown>;
  runCommand?: (config: Record<string, unknown>, context: Record<string, unknown>) => Promise<unknown>;
  runAI?: (config: Record<string, unknown>, context: Record<string, unknown>) => Promise<unknown>;
  assignAgent?: (config: Record<string, unknown>, context: Record<string, unknown>) => Promise<unknown>;
  createTicket?: (config: Record<string, unknown>, context: Record<string, unknown>) => Promise<unknown>;
  createOrder?: (config: Record<string, unknown>, context: Record<string, unknown>) => Promise<unknown>;
  addTag?: (config: Record<string, unknown>, context: Record<string, unknown>) => Promise<unknown>;
}

export class DefaultAutomationActionDispatcher {
  constructor(private readonly handlers: AutomationActionHandlers) {}

  async dispatch(action: AutomationAction, context: Record<string, unknown>) {
    const handlers: Record<string, ((config: Record<string, unknown>, ctx: Record<string, unknown>) => Promise<unknown>) | undefined> = {
      SEND_WHATSAPP: this.handlers.sendWhatsApp,
      RUN_COMMAND: this.handlers.runCommand,
      RUN_AI: this.handlers.runAI,
      ASSIGN_AGENT: this.handlers.assignAgent,
      CREATE_TICKET: this.handlers.createTicket,
      CREATE_ORDER: this.handlers.createOrder,
      ADD_TAG: this.handlers.addTag,
    };
    const handler = handlers[action.type];
    if (!handler) throw new Error(`No automation handler registered for ${action.type}`);
    return handler(action.config, context);
  }
}
