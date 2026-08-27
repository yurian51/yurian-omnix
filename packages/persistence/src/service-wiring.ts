import type { CustomerService } from "../../crm/src/services";
import type { OrderService, PaymentService, ProductService, TicketService } from "../../commerce/src/services";
import { createPostgresRepositories } from "./repositories";
import type { Pool } from "pg";

export function createApplicationServices(pool: Pool) {
  const repos = createPostgresRepositories(pool);
  const customers: CustomerService = repos.customers;
  const products: ProductService = repos.products;
  const orders: OrderService = repos.orders;
  const payments: PaymentService = repos.payments;
  const tickets: TicketService = repos.tickets;
  return { repos, customers, products, orders, payments, tickets };
}
