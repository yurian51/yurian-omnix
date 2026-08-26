import type { WhatsAppProvider, WhatsAppSendResult, WhatsAppTextMessage } from "./types";

export class WhatsAppCloudAPIProvider implements WhatsAppProvider {
  constructor(private readonly config: { phoneNumberId: string; accessToken: string; apiVersion: string }) {}

  async sendText(message: WhatsAppTextMessage): Promise<WhatsAppSendResult> {
    const response = await fetch(`https://graph.facebook.com/${this.config.apiVersion}/${this.config.phoneNumberId}/messages`, {
      method: "POST",
      headers: { authorization: `Bearer ${this.config.accessToken}`, "content-type": "application/json" },
      body: JSON.stringify({ messaging_product: "whatsapp", recipient_type: "individual", to: message.to, type: "text", text: { preview_url: message.previewUrl ?? false, body: message.body } }),
    });

    const payload: unknown = await response.json();
    if (!response.ok || !isRecord(payload)) throw new Error(`WhatsApp API request failed: ${response.status}`);
    const messages = Array.isArray(payload.messages) ? payload.messages : [];
    const first = messages[0];
    const id = isRecord(first) && typeof first.id === "string" ? first.id : null;
    if (!id) throw new Error("WhatsApp API response did not contain a message ID");
    return { providerMessageId: id, status: "ACCEPTED" };
  }
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
