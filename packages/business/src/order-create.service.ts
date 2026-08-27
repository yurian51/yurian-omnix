import type { PrismaClient } from "@prisma/client";

export type CreateOrderInput = {
  items: Array<{ productId: string; productVariantId?: string; quantity: number }>;
  currency?: string;
  notes?: string;
};

export class OrderCreateService {
  constructor(private readonly db: PrismaClient) {}

  async createOrder(tenantId: string, contactId: string, input: CreateOrderInput) {
    if (!input.items.length) throw new Error("Order must contain at least one item");
    if (input.items.some((item) => !Number.isInteger(item.quantity) || item.quantity <= 0)) {
      throw new Error("Order quantities must be positive integers");
    }

    return this.db.$transaction(async (tx) => {
      const ids = input.items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { tenantId, id: { in: ids }, status: "ACTIVE" },
        include: { variants: true },
      });

      const productMap = new Map(products.map((product) => [product.id, product]));
      let subtotal = 0;
      const items = input.items.map((item) => {
        const product = productMap.get(item.productId);
        if (!product) throw new Error(`Product unavailable: ${item.productId}`);
        const variant = item.productVariantId ? product.variants.find((v) => v.id === item.productVariantId) : product.variants[0];
        const unitPrice = variant?.price ?? product.basePrice;
        const lineTotal = Number(unitPrice) * item.quantity;
        subtotal += lineTotal;
        return { productId: product.id, productVariantId: variant?.id, quantity: item.quantity, unitPrice, total: lineTotal };
      });

      const order = await tx.order.create({
        data: {
          tenantId,
          contactId,
          orderNumber: `OMX-${Date.now()}-${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
          currency: input.currency ?? "TZS",
          subtotal,
          total: subtotal,
          notes: input.notes,
          status: "PENDING",
          items: { create: items },
        },
        include: { items: true },
      });

      return order;
    });
  }
}
