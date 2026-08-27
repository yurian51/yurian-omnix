export type WhatsAppProviderName = "META_CLOUD" | "BAILEYS" | "CUSTOM";
export type WhatsAppChannelStatus = "PENDING" | "CONNECTED" | "DISCONNECTED" | "ERROR";
export type WhatsAppChannel = { id: string; tenantId: string; provider: WhatsAppProviderName; phoneNumberId?: string; displayName?: string; status: WhatsAppChannelStatus };

export type WhatsAppTextMessage = { to: string; body: string; previewUrl?: boolean };
export type WhatsAppSendResult = { providerMessageId: string; status: "SENT" | "ACCEPTED" };
export interface WhatsAppProvider { sendText(message: WhatsAppTextMessage): Promise<WhatsAppSendResult>; }

export type WhatsAppMessage = { id: string; tenantId: string; channelId: string; conversationId: string; from: string; to?: string; type: "TEXT" | "IMAGE" | "VIDEO" | "AUDIO" | "DOCUMENT" | "STICKER" | "LOCATION" | "CONTACT" | "BUTTON" | "LIST"; text?: string; timestamp: string; metadata?: Record<string, unknown> };
export type WhatsAppEvent = { id: string; tenantId: string; channelId: string; type: "MESSAGE_RECEIVED" | "MESSAGE_SENT" | "MESSAGE_DELIVERED" | "MESSAGE_READ" | "MESSAGE_FAILED"; payload: Record<string, unknown>; occurredAt: string };
