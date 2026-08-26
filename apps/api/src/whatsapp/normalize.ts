import type { OmnixInboundMessage } from "./events";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

export function normalizeWhatsAppMessages(payload: Record<string, unknown>): OmnixInboundMessage[] {
  const entries = Array.isArray(payload.entry) ? payload.entry : [];
  const result: OmnixInboundMessage[] = [];

  for (const entryValue of entries) {
    const entry = asRecord(entryValue);
    const changes = entry && Array.isArray(entry.changes) ? entry.changes : [];
    for (const changeValue of changes) {
      const change = asRecord(changeValue);
      const value = change && asRecord(change.value);
      const metadata = value && asRecord(value.metadata);
      const phoneNumberId = typeof metadata?.phone_number_id === "string" ? metadata.phone_number_id : undefined;
      const messages = value && Array.isArray(value.messages) ? value.messages : [];
      if (!phoneNumberId) continue;

      for (const messageValue of messages) {
        const message = asRecord(messageValue);
        if (!message) continue;
        const from = typeof message.from === "string" ? message.from : undefined;
        const id = typeof message.id === "string" ? message.id : undefined;
        const timestamp = typeof message.timestamp === "string" ? message.timestamp : undefined;
        const type = typeof message.type === "string" ? message.type : "unknown";
        if (!from || !id || !timestamp) continue;

        const textRecord = asRecord(message.text);
        result.push({
          provider: "whatsapp",
          externalMessageId: id,
          phoneNumberId,
          from,
          timestamp,
          type: ["text", "image", "video", "audio", "document", "interactive"].includes(type)
            ? type as OmnixInboundMessage["type"]
            : "unknown",
          text: typeof textRecord?.body === "string" ? textRecord.body : undefined,
          raw: message,
        });
      }
    }
  }

  return result;
}
