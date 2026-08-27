import type { DeliveryStatusEvent } from "./delivery-status";

export type ProviderStatusPayload = { tenantId: string; channelId: string; providerMessageId: string; status: DeliveryStatusEvent["status"]; timestamp?: string; error?: string };

export function normalizeProviderStatus(payload: ProviderStatusPayload): DeliveryStatusEvent {
  return { tenantId: payload.tenantId, channelId: payload.channelId, providerMessageId: payload.providerMessageId, status: payload.status, occurredAt: payload.timestamp ?? new Date().toISOString(), error: payload.error };
}
