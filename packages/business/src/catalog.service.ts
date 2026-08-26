import type { PrismaClient } from "@prisma/client";

export class CatalogService {
  constructor(private readonly db: PrismaClient) {}

  async searchProducts(tenantId: string, query: string) {
    return this.db.product.findMany({
      where: {
        tenantId,
        status: "ACTIVE",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { sku: { contains: query, mode: "insensitive" } },
        ],
      },
      include: { variants: true },
      take: 20,
      orderBy: { updatedAt: "desc" },
    });
  }

  async getProduct(tenantId: string, productId: string) {
    return this.db.product.findFirst({
      where: { id: productId, tenantId, status: "ACTIVE" },
      include: { variants: true },
    });
  }
}
