import { InboxService, ConversationActionsService, ConversationNoteService, AgentReplyService } from "@omnix/business";

export function createInboxHandlers(deps: {
  inbox: InboxService;
  actions: ConversationActionsService;
  notes: ConversationNoteService;
  replies: AgentReplyService;
}) {
  return {
    list: (tenantId: string, filters?: Parameters<InboxService["listConversations"]>[1], page?: number, pageSize?: number) => deps.inbox.listConversations(tenantId, filters, page, pageSize),
    get: (tenantId: string, conversationId: string) => deps.inbox.getConversation(tenantId, conversationId),
    assign: (tenantId: string, conversationId: string, agentId: string | null) => deps.actions.assign(tenantId, conversationId, agentId),
    mode: (tenantId: string, conversationId: string, mode: "AI" | "HUMAN" | "HYBRID") => deps.actions.setMode(tenantId, conversationId, mode),
    status: (tenantId: string, conversationId: string, status: "OPEN" | "CLOSED" | "PENDING") => deps.actions.setStatus(tenantId, conversationId, status),
    read: (tenantId: string, conversationId: string) => deps.actions.markRead(tenantId, conversationId),
    note: (tenantId: string, conversationId: string, authorId: string, content: string) => deps.notes.add(tenantId, conversationId, authorId, content),
    reply: (tenantId: string, conversationId: string, agentId: string, body: string) => deps.replies.reply({ tenantId, conversationId, agentId, body }),
  };
}
