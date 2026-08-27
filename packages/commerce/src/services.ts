import type { Order, Payment, Product, Ticket } from "./types";

export interface ProductService { search(tenantId: string, query: string): Promise<Product[]>; get(tenantId: string, id: string): Promise<Product | null>; }
export interface OrderService { get(tenantId: string, id: string): Promise<Order | null>; create(input: { tenantId: string; customerId: string; items: { productId: string; quantity: number }[] }): Promise<Order>; update(tenantId: string, id: string, patch: Partial<Pick<Order, "status">>): Promise<Order>; }
export interface PaymentService { get(tenantId: string, id: string): Promise<Payment | null>; getByOrder(tenantId: string, orderId: string): Promise<Payment | null>; }
export interface TicketService { create(input: { tenantId: string; customerId: string; title: string; priority?: Ticket["priority"] }): Promise<Ticket>; assign(tenantId: string, id: string, agentId: string): Promise<Ticket>; }
