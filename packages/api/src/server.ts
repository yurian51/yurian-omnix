import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { randomUUID } from "node:crypto";
import { health } from "./health";

async function readJson(req: IncomingMessage) {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  if (!chunks.length) return undefined;
  const raw = Buffer.concat(chunks).toString("utf8");
  return JSON.parse(raw);
}

function send(res: ServerResponse, status: number, body: unknown, requestId: string) {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.setHeader("x-request-id", requestId);
  res.end(JSON.stringify(body));
}

export type ApiServerOptions = { port?: number; host?: string; requestHandler?: (input: { method: string; path: string; body?: unknown; requestId: string; req: IncomingMessage }) => Promise<{ status: number; body: unknown } | null> };
export function createApiServer(options: ApiServerOptions = {}) {
  return createServer(async (req, res) => {
    const requestId = String(req.headers["x-request-id"] ?? randomUUID());
    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
      if (req.method === "GET" && url.pathname === "/health") return send(res, 200, health(), requestId);
      const body = ["POST", "PUT", "PATCH"].includes(req.method ?? "") ? await readJson(req) : undefined;
      const result = options.requestHandler ? await options.requestHandler({ method: req.method ?? "GET", path: url.pathname, body, requestId, req }) : null;
      if (!result) return send(res, 404, { error: { code: "NOT_FOUND", message: "Route not found", requestId } }, requestId);
      return send(res, result.status, result.body, requestId);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid request";
      return send(res, 400, { error: { code: "BAD_REQUEST", message, requestId } }, requestId);
    }
  });
}

export async function startApiServer(server: ReturnType<typeof createApiServer>, options: { port?: number; host?: string } = {}) {
  const port = options.port ?? Number(process.env.PORT ?? 3000);
  const host = options.host ?? process.env.HOST ?? "0.0.0.0";
  await new Promise<void>((resolve) => server.listen(port, host, () => resolve()));
  return { port, host };
}
