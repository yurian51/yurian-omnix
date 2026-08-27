export type WhatsAppNumberRegistration = {
  tenantId: string;
  phoneNumberId: string;
  businessAccountId: string;
  displayPhoneNumber?: string;
};

export interface WhatsAppNumberOnboardingService {
  register(input: WhatsAppNumberRegistration): Promise<{ id: string; tenantId: string; phoneNumberId: string }>;
}

export function validateWhatsAppRegistration(input: WhatsAppNumberRegistration) {
  for (const key of ["tenantId", "phoneNumberId", "businessAccountId"] as const) {
    if (!input[key]?.trim()) throw new Error(`${key} is required`);
  }
  return input;
}
