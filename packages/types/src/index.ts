export type ID = string;

export type TenantContext = {
  tenantId: ID;
  userId?: ID;
};

export type WhatsAppCapability =
  | 'SEND_MESSAGES'
  | 'MEDIA'
  | 'TEMPLATES'
  | 'FLOWS'
  | 'GROUPS'
  | 'GROUP_CREATE'
  | 'GROUP_MANAGEMENT'
  | 'GROUP_INVITES'
  | 'GROUP_MESSAGING';

export type ConversationMode = 'AI' | 'HUMAN' | 'HYBRID';

export type MessageDirection = 'INBOUND' | 'OUTBOUND';

export type MessageSenderType = 'CUSTOMER' | 'AI' | 'AGENT' | 'SYSTEM';

export type MessageInput = {
  tenantId: ID;
  conversationId: ID;
  direction: MessageDirection;
  senderType: MessageSenderType;
  messageType: string;
  content?: string;
  whatsappMessageId?: string;
  metadata?: Record<string, unknown>;
};

export type ToolAuthorizationContext = TenantContext & {
  roles: string[];
  permissions: string[];
  approvalRequired?: boolean;
};

export type AIAction = {
  tool: string;
  arguments: Record<string, unknown>;
  requiresApproval: boolean;
};

export type OmnixEvent<T = unknown> = {
  id: ID;
  name: string;
  tenantId?: ID;
  occurredAt: string;
  payload: T;
};
