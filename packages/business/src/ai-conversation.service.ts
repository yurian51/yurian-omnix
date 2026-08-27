import type { PrismaClient } from "@prisma/client";
import { dispatchAIRequest } from "@omnix/queue";

export type AIConversationContext = {
  tenantId: string;
  conversationId: string;
  messageId: string;
};

export class AIConversationService {
  constructor(private readonly db: PrismaClient, private readonly redisUrl: string) {}

  async enqueue(context: AIConversationContext) {
    const conversation = await this.db.conversation.findFirst({
      where: { id: context.conversationId, tenantId: context.tenantId },
      select: { id: true, tenantId: true, mode: true, status: true },
    });

    if (!conversation) throw new Error("Conversation not found");
    if (conversation.mode === "HUMAN") return { queued: false, reason: "human_mode" as const };
    if (conversation.status === "CLOSED") return { queued: false, reason: "conversation_closed" as const };

    const message = await this.db.message.findFirst({
      where: { id: context.messageId, conversationId: conversation.id, tenantId: context.tenantId },
      select: { id: true, direction: true },
    });

    if (!message) throw new Error("Message not found");
    if (message.direction !== "INBOUND") return { queued: false, reason: "not_inbound" as const };

    await dispatchAIRequest(this.redisUrl, context);
    return { queued: true, conversationId: conversation.id, messageId: message.id };
  }
}
