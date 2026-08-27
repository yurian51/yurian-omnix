import { PrismaClient } from "@prisma/client";

export type DatabaseOptions = {
  log?: ("query" | "info" | "warn" | "error")[];
};

export function createDatabase(options: DatabaseOptions = {}): PrismaClient {
  return new PrismaClient({
    log: options.log,
  });
}
