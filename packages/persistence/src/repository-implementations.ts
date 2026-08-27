import type { Pool } from "pg";
import type { Order, Payment, Product, Ticket } from "../../commerce/src/types";
import type { StoredWhatsAppMessage } from "../../whatsapp/src/message-store";
import { withTenantTransaction } from "./postgres-client";

export function createCompleteRepositories(pool: Pool) {
  return {
    products: {
      get: (tenantId: string, id: string) => withTenantTransaction(pool, tenantId, async c => { const r = await c.query("SELECT * FROM products WHERE tenant_id=$1 AND id=$2", [tenantId,id]); return r.rows[0] ? r.rows[0] as Product : null; }),
      search: (tenantId: string, query: string) => withTenantTransaction(pool, tenantId, async c => { const r = await c.query("SELECT * FROM products WHERE tenant_id=$1 AND active=true AND (name ILIKE $2 OR COALESCE(sku,'') ILIKE $2) ORDER BY name LIMIT 50", [tenantId,`%${query}%`]); return r.rows as Product[]; })
    },
    orders: {
      get: (tenantId: string, id: string) => withTenantTransaction(pool, tenantId, async c => { const r = await c.query("SELECT o.*, COALESCE(json_agg(json_build_object('productId',oi.product_id,'quantity',oi.quantity,'unitPrice',oi.unit_price)) FILTER (WHERE oi.id IS NOT NULL),'[]') items FROM orders o LEFT JOIN order_items oi ON oi.tenant_id=o.tenant_id AND oi.order_id=o.id WHERE o.tenant_id=$1 AND o.id=$2 GROUP BY o.id", [tenantId,id]); return r.rows[0] ? { ...r.rows[0], tenantId:r.rows[0].tenant_id, customerId:r.rows[0].customer_id, subtotal:Number(r.rows[0].subtotal), total:Number(r.rows[0].total) } as Order : null; }),
      create: (input: {tenantId:string;customerId:string;items:{productId:string;quantity:number}[]}) => withTenantTransaction(pool,input.tenantId,async c=>{ if(!input.items.length) throw new Error("Order requires at least one item"); const ids=input.items.map(x=>x.productId); const products=await c.query("SELECT * FROM products WHERE tenant_id=$1 AND id=ANY($2::uuid[]) AND active=true FOR UPDATE",[input.tenantId,ids]); const byId=new Map(products.rows.map(p=>[p.id,p])); let subtotal=0; const priced=input.items.map(i=>{const p=byId.get(i.productId);if(!p)throw new Error(`Product unavailable: ${i.productId}`);if(i.quantity<1||p.stock<i.quantity)throw new Error(`Insufficient stock: ${i.productId}`);const unitPrice=Number(p.price);subtotal+=unitPrice*i.quantity;return {...i,unitPrice}}); const order=await c.query("INSERT INTO orders(tenant_id,customer_id,subtotal,total,currency,status) VALUES($1,$2,$3,$3,'TZS','PENDING') RETURNING *",[input.tenantId,input.customerId,subtotal]); for(const i of priced){await c.query("INSERT INTO order_items(tenant_id,order_id,product_id,quantity,unit_price) VALUES($1,$2,$3,$4,$5)",[input.tenantId,order.rows[0].id,i.productId,i.quantity,i.unitPrice]);await c.query("UPDATE products SET stock=stock-$3,updated_at=now() WHERE tenant_id=$1 AND id=$2",[input.tenantId,i.productId,i.quantity]);} return {...order.rows[0],tenantId:input.tenantId,customerId:input.customerId,items:priced,subtotal,total:subtotal,currency:'TZS'} as Order;})
    },
    payments: {
      get: (tenantId:string,id:string) => withTenantTransaction(pool,tenantId,async c=>{const r=await c.query("SELECT * FROM payments WHERE tenant_id=$1 AND id=$2",[tenantId,id]);return r.rows[0]?(r.rows[0] as Payment):null;}),
      getByOrder: (tenantId:string,orderId:string) => withTenantTransaction(pool,tenantId,async c=>{const r=await c.query("SELECT * FROM payments WHERE tenant_id=$1 AND order_id=$2 ORDER BY created_at DESC LIMIT 1",[tenantId,orderId]);return r.rows[0]?(r.rows[0] as Payment):null;})
    },
    tickets: {
      create: (input:{tenantId:string;customerId:string;title:string;priority?:Ticket['priority']})=>withTenantTransaction(pool,input.tenantId,async c=>{const r=await c.query("INSERT INTO tickets(tenant_id,customer_id,title,priority) VALUES($1,$2,$3,$4) RETURNING *",[input.tenantId,input.customerId,input.title,input.priority??'NORMAL']);return r.rows[0] as Ticket;}),
      assign: (tenantId:string,id:string,agentId:string)=>withTenantTransaction(pool,tenantId,async c=>{const r=await c.query("UPDATE tickets SET assigned_agent_id=$3,status='ASSIGNED',updated_at=now() WHERE tenant_id=$1 AND id=$2 RETURNING *",[tenantId,id,agentId]);if(!r.rows[0])throw new Error('Ticket not found');return r.rows[0] as Ticket;})
    },
    messages: {
      create: (m:StoredWhatsAppMessage)=>withTenantTransaction(pool,m.tenantId,async c=>{const r=await c.query("INSERT INTO messages(id,tenant_id,channel_id,conversation_id,provider_message_id,direction,message_type,sender,recipient,body,status,occurred_at) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *",[m.id,m.tenantId,m.channelId,m.conversationId,m.providerMessageId??null,m.direction,m.type,m.from,m.to,m.text??null,m.status,m.occurredAt]);return r.rows[0] as StoredWhatsAppMessage;}),
      listConversation: (tenantId:string,conversationId:string,limit=50)=>withTenantTransaction(pool,tenantId,async c=>{const safe=Math.min(Math.max(1,Math.trunc(limit)),200);const r=await c.query("SELECT * FROM messages WHERE tenant_id=$1 AND conversation_id=$2 ORDER BY occurred_at DESC LIMIT $3",[tenantId,conversationId,safe]);return r.rows as StoredWhatsAppMessage[];})
    }
  };
}
