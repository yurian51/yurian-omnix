import type { PrismaClient } from "@prisma/client";
import { dispatchOutgoingText } from "@omnix/queue";

export class AgentReplyService {
  constructor(private readonly db: PrismaClient, private readonly redisUrl: string) {}

  async reply(input: { tenantId: string; conversationId: string; agentId: string; body: string }) {
    if (!input.body.trim()) throw new Error("Reply body is required");

    const conversation = await this.db.conversation.findFirst({
      where: { id: input.conversationId, tenantId: input.tenantId },
      include: { contact: true },
    });
    if (!conversation) throw new Error("Conversation not found");
    if (!conversation.contact?.phone) throw new Error("Conversation contact has no phone number");

    const message = await this.db.message.create({
      data: {
        tenantId: input.tenantId,
        conversationId: conversation.id,
        direction: "OUTBOUND",
        senderType: "AGENT",
        content: input.body.trim(),
        status: "QUEUED",
      },
    });

    await dispatchOutgoingText(this.redisUrl, {
      tenantId: input.tenantId,
      phoneNumberId: conversation.phoneNumberId,
      to: conversation.contact.phone,
      body: input.body.trim(),
      idempotencyKey: `message:${message.id}`,
    });

    return message;
  }
}
