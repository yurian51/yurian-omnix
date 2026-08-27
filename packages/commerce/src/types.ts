export type Product = { id: string; tenantId: string; name: string; sku?: string; price: number; currency: string; stock: number; active: boolean };
export type OrderItem = { productId: string; quantity: number; unitPrice: number };
export type Order = { id: string; tenantId: string; customerId: string; items: OrderItem[]; subtotal: number; total: number; currency: string; status: "DRAFT" | "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED" };
export type Payment = { id: string; tenantId: string; orderId: string; amount: number; currency: string; status: "PENDING" | "PAID" | "FAILED" | "REFUNDED" };
export type Ticket = { id: string; tenantId: string; customerId: string; title: string; priority: "LOW" | "NORMAL" | "HIGH" | "URGENT"; status: "OPEN" | "ASSIGNED" | "RESOLVED" | "CLOSED" };
