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
  if (typeof value !== "string") return null;
  const normalized = value.toUpperCase();
  if (normalized === "SENT" || normalized === "DELIVERED" || normalized === "READ" || normalized === "FAILED") {
    return normalized;
  }
  return null;
}
