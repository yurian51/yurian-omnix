import type { CustomerService } from "../../crm/src/services";
import type { OrderService, PaymentService, ProductService, TicketService } from "../../commerce/src/services";
import type { createCompleteRepositories } from "./repository-implementations";

type Repositories = ReturnType<typeof createCompleteRepositories>;
export function createApplicationServiceAdapters(repos: Repositories) {
  const customers: CustomerService = {
    get: repos.customers.get,
    findByPhone: repos.customers.findByPhone,
    create: async input => repos.customers.save({ id: crypto.randomUUID(), ...input, status: "ACTIVE", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
    update: repos.customers.update
  };
  const products: ProductService = repos.products;
  const orders: OrderService = { get: repos.orders.get, create: repos.orders.create, update: async (tenantId,id,patch) => { throw new Error("Order update policy is not implemented yet"); } };
  const payments: PaymentService = repos.payments;
  const tickets: TicketService = repos.tickets;
  return { customers, products, orders, payments, tickets };
}
