import type { PrismaClient } from "@prisma/client";

export type SaveWebhookEventInput = {
  tenantId?: string;
  provider: string;
  externalEventId: string;
  eventType: string;
  payload: Record<string, unknown>;
};

export class WebhookEventRepository {
  constructor(private readonly db: PrismaClient) {}

  async save(input: SaveWebhookEventInput) {
    return this.db.webhookEvent.upsert({
      where: {
        provider_externalEventId: {
          provider: input.provider,
          externalEventId: input.externalEventId,
        },
      },
      create: {
        tenantId: input.tenantId,
        provider: input.provider,
        externalEventId: input.externalEventId,
        eventType: input.eventType,
        payload: input.payload,
      },
      update: {},
    });
  }
}
