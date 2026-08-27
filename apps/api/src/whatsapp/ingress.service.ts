import type { PrismaClient } from "@prisma/client";
import { WebhookEventRepository, WhatsAppPhoneRepository } from "@omnix/database";
import { createQueues, createRedisConnection, deterministicJobId } from "@omnix/queue";
import { AIConversationService } from "@omnix/business";
import { normalizeWhatsAppMessages } from "./normalize";
import { webhookEventId } from "./event-id";

export class WhatsAppIngressService {
  private readonly events: WebhookEventRepository;
  private readonly phones: WhatsAppPhoneRepository;
  private readonly ai: AIConversationService;

  constructor(private readonly db: PrismaClient, private readonly redisUrl: string) {
    this.events = new WebhookEventRepository(db);
    this.phones = new WhatsAppPhoneRepository(db);
    this.ai = new AIConversationService(db, redisUrl);
  }

  async ingest(payload: Record<string, unknown>) {
    const eventId = webhookEventId(payload);
    const messages = normalizeWhatsAppMessages(payload);
    const phoneNumberIds = [...new Set(messages.map((message) => message.phoneNumberId))];

    let tenantId: string | undefined;
    for (const phoneNumberId of phoneNumberIds) {
      const phone = await this.phones.findTenantByPhoneNumberId(phoneNumberId);
      const resolved = phone?.whatsappAccount?.tenantId;
      if (!resolved) continue;
      if (tenantId && tenantId !== resolved) {
        throw new Error("WhatsApp webhook contains messages for multiple tenants");
      }
      tenantId = resolved;
    }

    await this.events.save({
      tenantId,
      provider: "whatsapp",
      externalEventId: eventId,
      eventType: messages.length ? "message.received" : "webhook.received",
      payload,
    });

    if (!tenantId || !messages.length) {
      return { eventId, tenantId: tenantId ?? null, queued: 0 };
    }

    const connection = createRedisConnection(this.redisUrl);
    const queues = createQueues(connection);
    let queued = 0;
    try {
      for (const message of messages) {
        const job = await queues.incomingMessages.add(
          "process-message",
          {
            tenantId,
            phoneNumberId: message.phoneNumberId,
            externalMessageId: message.externalMessageId,
            from: message.from,
            timestamp: message.timestamp,
            type: message.type,
            text: message.text,
            raw: message.raw,
          },
          { jobId: deterministicJobId("message", `${tenantId}:${message.externalMessageId}`) },
        );
        if (job) queued += 1;
      }
    } finally {
      await connection.quit();
    }

    return { eventId, tenantId, queued };
  }

  async enqueueAI(input: { tenantId: string; conversationId: string; messageId: string }) {
    return this.ai.enqueue(input);
  }
}
