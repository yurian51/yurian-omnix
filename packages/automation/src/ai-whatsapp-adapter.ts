import type { ToolHandler } from "./ai-tool-gateway";
import type { OutboundWhatsAppJob, OutboundWhatsAppQueue } from "../../whatsapp/src/outbound-queue";

export function createWhatsAppToolHandlers(queue: OutboundWhatsAppQueue, idFactory: () => string = () => `msg_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`): Record<string, ToolHandler> {
  return {
    "whatsapp.send": async (args, ctx) => {
      const to = String(args.to ?? "");
      const body = String(args.body ?? "");
      if (!to || !body) throw new Error("whatsapp.send requires to and body");
      const messageId = idFactory();
      const job: OutboundWhatsAppJob = { id: `job_${messageId}`, tenantId: ctx.tenantId, channelId: String(args.channelId ?? ""), messageId, to, body, attempts: 0, maxAttempts: Math.max(1, Number(args.maxAttempts ?? 3)), status: "QUEUED" };
      await queue.enqueue(job);
      return { queued: true, messageId, jobId: job.id };
    },
    "whatsapp.template.send": async (args, ctx) => {
      const template = String(args.template ?? "");
      const to = String(args.to ?? "");
      if (!template || !to) throw new Error("whatsapp.template.send requires template and to");
      const messageId = idFactory();
      const body = String(args.body ?? template);
      const job: OutboundWhatsAppJob = { id: `job_${messageId}`, tenantId: ctx.tenantId, channelId: String(args.channelId ?? ""), messageId, to, body, attempts: 0, maxAttempts: Math.max(1, Number(args.maxAttempts ?? 3)), status: "QUEUED" };
      await queue.enqueue(job);
      return { queued: true, messageId, jobId: job.id, template };
    },
  };
}
