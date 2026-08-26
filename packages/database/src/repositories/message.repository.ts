import type { PrismaClient } from "@prisma/client";

export class MessageRepository {
  constructor(private readonly db: PrismaClient) {}

  async upsertInbound(input: {
    tenantId: string;
    phoneNumberId: string;
    externalMessageId: string;
    from: string;
    timestamp: Date;
    type: any;
    content?: string;
    raw: Record<string, unknown>;
  }) {
    const contact = await this.db.contact.upsert({
      where: { tenantId_phone: { tenantId: input.tenantId, phone: input.from } },
      create: { tenantId: input.tenantId, phone: input.from, lastInteractionAt: input.timestamp },
      update: { lastInteractionAt: input.timestamp },
    });

    const conversation = await this.db.conversation.findFirst({
      where: { tenantId: input.tenantId, contactId: contact.id, whatsappPhoneId: input.phoneNumberId, status: { not: "CLOSED" } },
      orderBy: { updatedAt: "desc" },
    });

    const activeConversation = conversation ?? await this.db.conversation.create({
      data: {
        tenantId: input.tenantId,
        contactId: contact.id,
        whatsappPhoneId: input.phoneNumberId,
        mode: "AI",
        status: "OPEN",
        lastMessageAt: input.timestamp,
      },
    });

    const message = await this.db.message.upsert({
      where: { tenantId_whatsappMessageId: { tenantId: input.tenantId, whatsappMessageId: input.externalMessageId } },
      create: {
        tenantId: input.tenantId,
        conversationId: activeConversation.id,
        whatsappMessageId: input.externalMessageId,
        direction: "INBOUND",
        senderType: "CUSTOMER",
        messageType: input.type,
        content: input.content,
        status: "DELIVERED",
        metadata: input.raw,
        createdAt: input.timestamp,
        processedAt: new Date(),
      },
      update: {},
    });

    await this.db.conversation.update({ where: { id: activeConversation.id }, data: { lastMessageAt: input.timestamp, updatedAt: new Date() } });
    return { contact, conversation: activeConversation, message };
  }
}
