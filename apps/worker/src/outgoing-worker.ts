import type { Job } from "bullmq";
import type { OutgoingMessageJob } from "@omnix/queue";
import { createDatabase, OutboundMessageRepository } from "@omnix/database";
import { WhatsAppCloudAPIProvider } from "@omnix/whatsapp";

const db = createDatabase();
const outboundMessages = new OutboundMessageRepository(db);

export async function processOutgoingMessage(job: Job<OutgoingMessageJob>) {
  const input = job.data;
  if (input.type !== "text") throw new Error(`Unsupported outbound type: ${input.type}`);

  const body = String(input.payload.body ?? "").trim();
  if (!body) throw new Error("Outbound text body is required");

  const message = await outboundMessages.createPending({
    tenantId: input.tenantId,
    conversationId: input.conversationId,
    type: "TEXT",
    content: body,
    idempotencyKey: input.idempotencyKey,
    metadata: { channel: "whatsapp", to: input.to, phoneNumberId: input.phoneNumberId },
  });

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const apiVersion = process.env.WHATSAPP_API_VERSION ?? "v23.0";
  if (!accessToken) throw new Error("WHATSAPP_ACCESS_TOKEN is required");

  const provider = new WhatsAppCloudAPIProvider({
    phoneNumberId: input.phoneNumberId,
    accessToken,
    apiVersion,
  });

  try {
    const result = await provider.sendText({ to: input.to, body });
    await outboundMessages.markAccepted({ id: message.id, providerMessageId: result.providerMessageId });
    return { messageId: message.id, ...result };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown outbound WhatsApp error";
    await outboundMessages.markFailed({ id: message.id, error: errorMessage });
    throw error;
  }
}
