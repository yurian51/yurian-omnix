export type OmnixInboundMessage = {
  provider: "whatsapp";
  externalMessageId: string;
  phoneNumberId: string;
  from: string;
  timestamp: string;
  type: "text" | "image" | "video" | "audio" | "document" | "interactive" | "unknown";
  text?: string;
  raw: Record<string, unknown>;
};

export type OmnixWebhookEvent = {
  provider: "whatsapp";
  externalEventId: string;
  type: string;
  payload: Record<string, unknown>;
};
