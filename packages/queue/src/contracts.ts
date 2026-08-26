export const QUEUES = {
  webhook: "omnix.webhook.processing",
  incomingMessages: "omnix.whatsapp.incoming",
  outgoingMessages: "omnix.whatsapp.outgoing",
  ai: "omnix.ai.requests",
} as const;

export type QueueName = (typeof QUEUES)[keyof typeof QUEUES];

export type WebhookProcessingJob = {
  tenantId?: string;
  provider: "whatsapp";
  externalEventId: string;
  eventType: string;
  payload: Record<string, unknown>;
};

export type IncomingMessageJob = {
  tenantId: string;
  phoneNumberId: string;
  externalMessageId: string;
  from: string;
  timestamp: string;
  type: string;
  text?: string;
  raw: Record<string, unknown>;
};

export type OutgoingMessageJob = {
  tenantId: string;
  phoneNumberId: string;
  to: string;
  type: "text" | "template" | "interactive" | "media";
  payload: Record<string, unknown>;
  idempotencyKey: string;
};

export type AIRequestJob = {
  tenantId: string;
  conversationId: string;
  messageId: string;
};
