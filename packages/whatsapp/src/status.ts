export type WhatsAppDeliveryStatus = "SENT" | "DELIVERED" | "READ" | "FAILED";

export type WhatsAppStatusEvent = {
  providerMessageId: string;
  status: WhatsAppDeliveryStatus;
  timestamp?: string;
  recipientId?: string;
  errorCode?: string;
  errorMessage?: string;
};

export function normalizeDeliveryStatus(value: unknown): WhatsAppDeliveryStatus | null {
  if (value === "sent" || value === "delivered" || value === "read" || value === "failed") {
    return value.toUpperCase() as WhatsAppDeliveryStatus;
  }
  return null;
}
