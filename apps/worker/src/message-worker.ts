import type { Job } from "bullmq";
import type { IncomingMessageJob } from "@omnix/queue";
import { createDatabase, MessageRepository } from "@omnix/database";

const db = createDatabase();
const messages = new MessageRepository(db);

export async function processIncomingMessage(job: Job<IncomingMessageJob>) {
  const input = job.data;
  const result = await messages.upsertInbound({
    tenantId: input.tenantId,
    phoneNumberId: input.phoneNumberId,
    externalMessageId: input.externalMessageId,
    from: input.from,
    timestamp: new Date(Number(input.timestamp) * 1000),
    type: input.type as never,
    content: input.text,
    raw: input.raw,
  });

  return {
    messageId: result.message.id,
    conversationId: result.conversation.id,
    contactId: result.contact.id,
  };
}
