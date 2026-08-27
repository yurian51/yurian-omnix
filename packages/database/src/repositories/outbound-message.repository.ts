import type { MessageType, PrismaClient } from "@prisma/client";

export class OutboundMessageRepository {
  constructor(private readonly db: PrismaClient) {}

  async createPending(input: {
    tenantId: string;
    conversationId: string;
    type: MessageType;
    content?: string;
    idempotencyKey: string;
    metadata?: Record<string, unknown>;
  }) {
    const existing = await this.db.message.findFirst({
      where: {
        tenantId: input.tenantId,
        conversationId: input.conversationId,
        direction: "OUTBOUND",
        metadata: { path: ["idempotencyKey"], equals: input.idempotencyKey },
      },
    });
    if (existing) return existing;

    return this.db.message.create({
      data: {
        tenantId: input.tenantId,
        conversationId: input.conversationId,
        direction: "OUTBOUND",
        senderType: "AI",
        messageType: input.type,
        content: input.content,
        status: "PENDING",
        metadata: { ...(input.metadata ?? {}), idempotencyKey: input.idempotencyKey },
      },
    });
  }

  async markAccepted(input: { id: string; providerMessageId: string }) {
    return this.db.message.update({
      where: { id: input.id },
      data: {
        whatsappMessageId: input.providerMessageId,
        status: "SENT",
        processedAt: new Date(),
      },
    });
  }

  async markFailed(input: { id: string; error: string }) {
    const current = await this.db.message.findUnique({ where: { id: input.id }, select: { metadata: true } });
    const metadata = isRecord(current?.metadata) ? current.metadata : {};
    return this.db.message.update({
      where: { id: input.id },
      data: {
        status: "FAILED",
        processedAt: new Date(),
        metadata: { ...metadata, outboundError: input.error },
      },
    });
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
