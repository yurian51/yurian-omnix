import type { Job } from "bullmq";
import type { OutgoingMessageJob } from "@omnix/queue";
import { WhatsAppCloudAPIProvider } from "@omnix/whatsapp";

export async function processOutgoingMessage(job: Job<OutgoingMessageJob>) {
  const input = job.data;
  if (input.type !== "text") throw new Error(`Unsupported outbound type: ${input.type}`);

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const apiVersion = process.env.WHATSAPP_API_VERSION ?? "v23.0";
  if (!accessToken) throw new Error("WHATSAPP_ACCESS_TOKEN is required");

  const provider = new WhatsAppCloudAPIProvider({
    phoneNumberId: input.phoneNumberId,
    accessToken,
    apiVersion,
  });

  return provider.sendText({
    to: input.to,
    body: String(input.payload.body ?? ""),
  });
}
