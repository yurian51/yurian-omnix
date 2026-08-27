export type WhatsAppDeliveryStatus = "SENT" | "DELIVERED" | "READ" | "FAILED";
export type DeliveryStatusEvent = { tenantId: string; channelId: string; providerMessageId: string; status: WhatsAppDeliveryStatus; occurredAt: string; error?: string };

export interface DeliveryStatusStore { findByProviderMessageId(providerMessageId: string, tenantId: string): Promise<{ id: string } | null>; updateStatus(messageId: string, tenantId: string, status: WhatsAppDeliveryStatus): Promise<void>; }

export async function applyDeliveryStatus(event: DeliveryStatusEvent, store: DeliveryStatusStore) {
  if (!event.tenantId || !event.channelId || !event.providerMessageId) throw new Error("Invalid delivery status event");
  const message = await store.findByProviderMessageId(event.providerMessageId, event.tenantId);
  if (!message) throw new Error("Message not found for provider message ID");
  await store.updateStatus(message.id, event.tenantId, event.status);
  return message.id;
}
