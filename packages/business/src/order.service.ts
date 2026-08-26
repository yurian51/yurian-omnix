import type { PrismaClient } from "@prisma/client";

export class OrderService {
  constructor(private readonly db: PrismaClient) {}

  async getOrder(tenantId: string, orderId: string) {
    return this.db.order.findFirst({
      where: { id: orderId, tenantId },
      include: { items: { include: { product: true, productVariant: true } }, payments: true },
    });
  }
}
