import type { IncomingMessage, ServerResponse } from "node:http";
import type { AuthContext, TokenResolver } from "./auth";
import { requireBearerAuth } from "./auth";
import type { InboxService, ConversationActionsService, ConversationNoteService, AgentReplyService } from "@omnix/business";

export function createInboxHttpRouter(deps: {
  inbox: InboxService;
  actions: ConversationActionsService;
  notes: ConversationNoteService;
  replies: AgentReplyService;
  resolveToken: TokenResolver;
}) {
  return async function route(req: IncomingMessage, res: ServerResponse, context: { url: URL }) {
    if (!context.url.pathname.startsWith("/api/v1/inbox")) return false;
    let auth: AuthContext;
    try {
      const token = requireBearerAuth(Array.isArray(req.headers.authorization) ? req.headers.authorization[0] : req.headers.authorization);
      const resolved = await deps.resolveToken(token);
      if (!resolved) throw new Error("unauthorized");
      auth = resolved;
    } catch {
      res.writeHead(401, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "unauthorized" }));
      return true;
    }

    const parts = context.url.pathname.split("/").filter(Boolean);
    const conversationId = parts[3];
    const action = parts[4];
    const send = (status: number, body: unknown) => { res.writeHead(status, { "content-type": "application/json" }); res.end(JSON.stringify(body)); };

    if (req.method === "GET" && !conversationId) {
      send(200, await deps.inbox.listConversations(auth.tenantId, {
        search: context.url.searchParams.get("search") ?? undefined,
        status: (context.url.searchParams.get("status") as any) || undefined,
        mode: (context.url.searchParams.get("mode") as any) || undefined,
        assignedAgentId: context.url.searchParams.get("agentId") ?? undefined,
      }, Number(context.url.searchParams.get("page") ?? 1), Number(context.url.searchParams.get("pageSize") ?? 50)));
      return true;
    }

    if (req.method === "GET" && conversationId && !action) {
      send(200, await deps.inbox.getConversation(auth.tenantId, conversationId));
      return true;
    }

    if (req.method === "POST" && conversationId && action) {
      const chunks: Buffer[] = [];
      req.on("data", (chunk: Buffer) => chunks.push(chunk));
      await new Promise<void>((resolve) => req.on("end", () => resolve()));
      let body: any = {};
      try { body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}"); } catch { send(400, { error: "invalid_json" }); return true; }
      if (action === "assign") send(200, await deps.actions.assign(auth.tenantId, conversationId, body.agentId ?? null));
      else if (action === "mode") send(200, await deps.actions.setMode(auth.tenantId, conversationId, body.mode));
      else if (action === "status") send(200, await deps.actions.setStatus(auth.tenantId, conversationId, body.status));
      else if (action === "read") send(200, await deps.actions.markRead(auth.tenantId, conversationId));
      else if (action === "note") send(201, await deps.notes.add(auth.tenantId, conversationId, auth.userId, String(body.content ?? "")));
      else if (action === "reply") send(201, await deps.replies.reply({ tenantId: auth.tenantId, conversationId, agentId: auth.userId, body: String(body.body ?? "") }));
      else send(404, { error: "not_found" });
      return true;
    }
    send(404, { error: "not_found" });
    return true;
  };
}
