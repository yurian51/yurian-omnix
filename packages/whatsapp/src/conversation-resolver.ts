export type Conversation = { id: string; tenantId: string; channelId: string; customerId: string; status: "OPEN" | "CLOSED"; lastMessageAt?: string };
export type Customer = { id: string; tenantId: string; phone: string; name?: string };

export interface CustomerResolver { resolve(tenantId: string, phone: string): Promise<Customer>; }
export interface ConversationStore { findOpen(tenantId: string, channelId: string, customerId: string): Promise<Conversation | null>; create(input: Omit<Conversation, "id">): Promise<Conversation>; touch(id: string, lastMessageAt: string): Promise<Conversation>; }

export class WhatsAppConversationResolver {
  constructor(private readonly customers: CustomerResolver, private readonly conversations: ConversationStore) {}

  async resolve(tenantId: string, channelId: string, phone: string, timestamp: string) {
    const customer = await this.customers.resolve(tenantId, phone);
    const existing = await this.conversations.findOpen(tenantId, channelId, customer.id);
    if (existing) return { customer, conversation: await this.conversations.touch(existing.id, timestamp) };
    const conversation = await this.conversations.create({ tenantId, channelId, customerId: customer.id, status: "OPEN", lastMessageAt: timestamp });
    return { customer, conversation };
  }
}
