import type { Pool } from "pg";
import type { Customer } from "../../crm/src/types";
import type { Order, Payment, Product, Ticket } from "../../commerce/src/types";
import type { StoredWhatsAppMessage } from "../../whatsapp/src/message-store";
import { withTenantTransaction } from "./postgres-client";

const mapCustomer = (r: any): Customer => ({ id: r.id, tenantId: r.tenant_id, name: r.name, phone: r.phone ?? undefined, email: r.email ?? undefined, status: r.status, createdAt: r.created_at, updatedAt: r.updated_at });
const mapMessage = (r: any): StoredWhatsAppMessage => ({ id: r.id, tenantId: r.tenant_id, channelId: r.channel_id, conversationId: r.conversation_id, providerMessageId: r.provider_message_id ?? undefined, direction: r.direction, from: r.sender, to: r.recipient, type: r.message_type, text: r.body ?? undefined, status: r.status, occurredAt: r.occurred_at });

export function createPostgresRepositories(pool: Pool) {
  return {
    customers: {
      get: (tenantId: string, id: string) => withTenantTransaction(pool, tenantId, async c => { const r = await c.query("SELECT * FROM customers WHERE tenant_id=$1 AND id=$2", [tenantId, id]); return r.rows[0] ? mapCustomer(r.rows[0]) : null; }),
      findByPhone: (tenantId: string, phone: string) => withTenantTransaction(pool, tenantId, async c => { const r = await c.query("SELECT * FROM customers WHERE tenant_id=$1 AND phone=$2", [tenantId, phone]); return r.rows[0] ? mapCustomer(r.rows[0]) : null; }),
      save: (customer: Customer) => withTenantTransaction(pool, customer.tenantId, async c => { const r = await c.query("INSERT INTO customers(id,tenant_id,name,phone,email,status) VALUES($1,$2,$3,$4,$5,$6) RETURNING *", [customer.id, customer.tenantId, customer.name, customer.phone ?? null, customer.email ?? null, customer.status]); return mapCustomer(r.rows[0]); }),
      update: (tenantId: string, id: string, patch: Partial<Customer>) => withTenantTransaction(pool, tenantId, async c => { const r = await c.query("UPDATE customers SET name=COALESCE($3,name), phone=COALESCE($4,phone), email=COALESCE($5,email), status=COALESCE($6,status), updated_at=now() WHERE tenant_id=$1 AND id=$2 RETURNING *", [tenantId, id, patch.name ?? null, patch.phone ?? null, patch.email ?? null, patch.status ?? null]); if (!r.rows[0]) throw new Error("Customer not found"); return mapCustomer(r.rows[0]); })
    },
    messages: {
      findByProviderMessageId: (tenantId: string, providerMessageId: string) => withTenantTransaction(pool, tenantId, async c => { const r = await c.query("SELECT * FROM messages WHERE tenant_id=$1 AND provider_message_id=$2", [tenantId, providerMessageId]); return r.rows[0] ? mapMessage(r.rows[0]) : null; }),
      updateStatus: (tenantId: string, id: string, status: StoredWhatsAppMessage["status"]) => withTenantTransaction(pool, tenantId, async c => { const r = await c.query("UPDATE messages SET status=$3 WHERE tenant_id=$1 AND id=$2", [tenantId, id, status]); if (r.rowCount !== 1) throw new Error("Message not found"); })
    },
    products: {
      search: (tenantId: string, query: string) => withTenantTransaction(pool, tenantId, async c => { const r = await c.query("SELECT * FROM products WHERE tenant_id=$1 AND active=true AND (name ILIKE $2 OR COALESCE(sku,'') ILIKE $2) ORDER BY name LIMIT 50", [tenantId, `%${query}%`]); return r.rows as Product[]; })
    },
    orders: {
      get: async (_tenantId: string, _id: string): Promise<Order | null> => null
    },
    payments: {
      get: async (_tenantId: string, _id: string): Promise<Payment | null> => null
    },
    tickets: {
      create: async (_input: { tenantId: string; customerId: string; title: string; priority?: Ticket["priority"] }): Promise<Ticket> => { throw new Error("Ticket repository implementation pending"); }
    }
  };
}
