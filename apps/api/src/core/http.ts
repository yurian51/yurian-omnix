import type { ServerResponse } from "node:http";

export function json(res: ServerResponse, statusCode: number, payload: unknown): void {
  res.writeHead(statusCode, { "content-type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

export function notFound(res: ServerResponse): void {
  json(res, 404, { error: "not_found" });
}
