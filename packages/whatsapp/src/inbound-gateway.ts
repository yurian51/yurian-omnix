export type WhatsAppInboundEvent = {
  tenantId: string;
  channelId: string;
  providerMessageId: string;
  from: string;
  to: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "STICKER" | "LOCATION" | "CONTACT" | "BUTTON" | "LIST";
  text?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
};

export interface WhatsAppInboundHandler {
  handle(event: WhatsAppInboundEvent): Promise<void>;
}

export class WhatsAppInboundGateway {
  constructor(private readonly handler: WhatsAppInboundHandler) {}

  async receive(event: WhatsAppInboundEvent) {
    if (!event.tenantId.trim()) throw new Error("Tenant context is required");
    if (!event.channelId.trim()) throw new Error("WhatsApp channel is required");
    if (!event.providerMessageId.trim()) throw new Error("Provider message ID is required");
    if (!event.from.trim()) throw new Error("Sender is required");
    return this.handler.handle(event);
  }
}
