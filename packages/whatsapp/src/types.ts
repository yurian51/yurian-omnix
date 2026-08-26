export type WhatsAppTextMessage = {
  to: string;
  body: string;
  previewUrl?: boolean;
};

export type WhatsAppSendResult = {
  providerMessageId: string;
  status: "SENT" | "ACCEPTED";
};

export interface WhatsAppProvider {
  sendText(message: WhatsAppTextMessage): Promise<WhatsAppSendResult>;
}
