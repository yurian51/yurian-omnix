export type PaymentIntent = {
  tenantId: string;
  orderId: string;
  amount: number;
  currency: string;
  provider: string;
};

export interface PaymentIntentService {
  create(input: PaymentIntent): Promise<{ provider: string; reference: string; status: "PENDING" }>;
}

export class PendingPaymentIntentService implements PaymentIntentService {
  async create(input: PaymentIntent) {
    return {
      provider: input.provider,
      reference: `OMX-PAY-${Date.now()}`,
      status: "PENDING" as const,
    };
  }
}
