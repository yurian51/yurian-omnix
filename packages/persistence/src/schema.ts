export const tables = { tenants: "tenants", whatsappChannels: "whatsapp_channels", customers: "customers", conversations: "conversations", messages: "messages", products: "products", orders: "orders", orderItems: "order_items", payments: "payments", tickets: "tickets", aiAgents: "ai_agents", aiMemories: "ai_memories", workflowExecutions: "workflow_executions", auditEvents: "audit_events" } as const;

export type TenantScopedEntity = { id: string; tenantId: string; createdAt: string; updatedAt?: string };
export type SchemaConstraint = { table: string; name: string; columns: string[]; kind: "PRIMARY_KEY" | "FOREIGN_KEY" | "UNIQUE" | "INDEX" };

export const coreConstraints: SchemaConstraint[] = [
  { table: "whatsapp_channels", name: "uq_whatsapp_channel_phone", columns: ["tenant_id", "phone_number_id"], kind: "UNIQUE" },
  { table: "customers", name: "uq_customer_phone", columns: ["tenant_id", "phone"], kind: "UNIQUE" },
  { table: "messages", name: "uq_message_provider_id", columns: ["tenant_id", "provider_message_id"], kind: "UNIQUE" },
  { table: "messages", name: "idx_messages_conversation_created", columns: ["tenant_id", "conversation_id", "created_at"], kind: "INDEX" },
  { table: "orders", name: "idx_orders_customer_created", columns: ["tenant_id", "customer_id", "created_at"], kind: "INDEX" },
  { table: "ai_memories", name: "idx_ai_memory_customer_updated", columns: ["tenant_id", "customer_id", "updated_at"], kind: "INDEX" },
  { table: "audit_events", name: "idx_audit_tenant_occurred", columns: ["tenant_id", "occurred_at"], kind: "INDEX" },
];
