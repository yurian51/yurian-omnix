import type { PrismaClient } from "@prisma/client";

export class MessageStatusRepository {
  constructor(private readonly db: PrismaClient) {}

  async updateByProviderMessageId(input: {
    tenantId: string;
    providerMessageId: string;
    status: "SENT" | "DELIVERED" | "READ" | "FAILED";
    errorCode?: string;
    errorMessage?: string;
  }) {
    const message = await this.db.message.findFirst({
      where: { tenantId: input.tenantId, whatsappMessageId: input.providerMessageId },
      select: { id: true, conversationId: true, metadata: true },
    });
    if (!message) return null;

    const existingMetadata = isRecord(message.metadata) ? message.metadata : {};
    const delivery = {
      status: input.status,
      updatedAt: new Date().toISOString(),
      ...(input.errorCode ? { errorCode: input.errorCode } : {}),
      ...(input.errorMessage ? { errorMessage: input.errorMessage } : {}),
    };

    return this.db.message.update({
      where: { id: message.id },
      data: {
        status: input.status,
        metadata: { ...existingMetadata, delivery },
      },
    });
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
