import type { PrismaClient } from "@prisma/client";
import { WebhookEventRepository, WhatsAppPhoneRepository } from "@omnix/database";
import { createQueues, createRedisConnection, deterministicJobId } from "@omnix/queue";
import { normalizeWhatsAppMessages } from "./normalize";
import { webhookEventId } from "./event-id";

export class WhatsAppIngressService {
  private readonly events: WebhookEventRepository;
  private readonly phones: WhatsAppPhoneRepository;

  constructor(private readonly db: PrismaClient, private readonly redisUrl: string) {
    this.events = new WebhookEventRepository(db);
    this.phones = new WhatsAppPhoneRepository(db);
  }

  async ingest(payload: Record<string, unknown>) {
    const eventId = webhookEventId(payload);
    const messages = normalizeWhatsAppMessages(payload);
    const phoneNumberId = messages[0]?.phoneNumberId;
    const phone = phoneNumberId ? await this.phones.findTenantByPhoneNumberId(phoneNumberId) : null;
    const tenantId = phone?.whatsappAccount?.tenantId;

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
    try {
      await Promise.all(messages.map((message) => queues.incomingMessages.add(
        "process-message",
        { tenantId, phoneNumberId: message.phoneNumberId, externalMessageId: message.externalMessageId, from: message.from, timestamp: message.timestamp, type: message.type, text: message.text, raw: message.raw },
        { jobId: deterministicJobId("message", `${tenantId}:${message.externalMessageId}`) },
      )));
    } finally {
      await connection.quit();
    }

    return { eventId, tenantId, queued: messages.length };
  }
}
