import type { Pool } from "pg";
import { createPostgresRepositories } from "./repositories";

export function createRepositoryFactory(pool: Pool) {
  if (!pool) throw new Error("PostgreSQL pool is required");
  return createPostgresRepositories(pool);
}
