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
      select: { id: true, conversationId: true },
    });
    if (!message) return null;

    return this.db.message.update({
      where: { id: message.id },
      data: {
        status: input.status,
        errorCode: input.errorCode,
        errorMessage: input.errorMessage,
      },
    });
  }
}
