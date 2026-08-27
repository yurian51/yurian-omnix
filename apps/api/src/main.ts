import { createServer } from "node:http";
import { loadEnv } from "./core/env";
import { json, notFound } from "./core/http";
import { parseWebhookPayload, verifySignature, verifyWebhookChallenge } from "./whatsapp/webhook";

const env = loadEnv();
const port = env.port;

const server = createServer((req, res) => {
  const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);

  if (url.pathname === "/health" && req.method === "GET") {
    json(res, 200, { status: "ok", service: "omnix-api" });
    return;
  }

  if (url.pathname === "/webhooks/whatsapp" && req.method === "GET") {
    const challenge = verifyWebhookChallenge(
      url.searchParams.get("hub.mode") ?? undefined,
      url.searchParams.get("hub.verify_token") ?? undefined,
      url.searchParams.get("hub.challenge") ?? undefined,
      env.whatsappVerifyToken,
    );
    if (challenge !== null) {
      res.writeHead(200, { "content-type": "text/plain; charset=utf-8" });
      res.end(challenge);
      return;
    }
    json(res, 403, { error: "webhook_verification_failed" });
    return;
  }

  if (url.pathname === "/webhooks/whatsapp" && req.method === "POST") {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const rawBody = Buffer.concat(chunks).toString("utf8");
      const signature = req.headers["x-hub-signature-256"];
      const signatureValue = Array.isArray(signature) ? signature[0] : signature;

      if (!verifySignature(rawBody, signatureValue, env.whatsappAppSecret)) {
        json(res, 401, { error: "invalid_signature" });
        return;
      }

      try {
        const payload = parseWebhookPayload(rawBody);
        // Persistence and queue dispatch are intentionally the next layer.
        json(res, 200, { received: true, object: payload.object ?? null });
      } catch {
        json(res, 400, { error: "invalid_payload" });
      }
    });
    return;
  }

  notFound(res);
});

server.listen(port, () => {
  console.log(`OMNIX API listening on :${port}`);
});
