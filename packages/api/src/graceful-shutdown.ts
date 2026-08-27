import type { Server } from "node:http";
export function installGracefulShutdown(server: Server, closeResources: () => Promise<void> = async () => {}) {
  let shuttingDown = false;
  const shutdown = async () => { if (shuttingDown) return; shuttingDown = true; server.close(async () => { await closeResources(); process.exit(0); }); setTimeout(() => process.exit(1), 10_000).unref(); };
  process.once("SIGTERM", shutdown);
  process.once("SIGINT", shutdown);
  return shutdown;
}
