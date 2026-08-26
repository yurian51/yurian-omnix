import type { PrismaClient } from "@prisma/client";

export class InventoryService {
  constructor(private readonly db: PrismaClient) {}

  async validateAvailability(items: Array<{ productVariantId: string; quantity: number }>) {
    const variants = await this.db.productVariant.findMany({ where: { id: { in: items.map((item) => item.productVariantId) } } });
    const byId = new Map(variants.map((variant) => [variant.id, variant]));
    for (const item of items) {
      const variant = byId.get(item.productVariantId);
      if (!variant || variant.stockQuantity < item.quantity) throw new Error(`Insufficient stock: ${item.productVariantId}`);
    }
    return true;
  }
}
