import { AsyncLocalStorage } from "node:async_hooks";
import { Pool, type PoolClient, type QueryResultRow } from "pg";

const tenantContext = new AsyncLocalStorage<string>();

export function createPostgresPool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error("DATABASE_URL is required");
  return new Pool({ connectionString, max: Number(process.env.DB_POOL_MAX ?? 20), idleTimeoutMillis: 30_000 });
}

export function currentTenantId() { return tenantContext.getStore() ?? null; }

export async function withTenantTransaction<T>(pool: Pool, tenantId: string, work: (client: PoolClient) => Promise<T>): Promise<T> {
  if (!tenantId.trim()) throw new Error("tenantId is required");
  return tenantContext.run(tenantId, async () => {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
      const result = await work(client);
      await client.query("COMMIT");
      return result;
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  });
}

export async function queryTenant<T extends QueryResultRow = QueryResultRow>(client: PoolClient, sql: string, params: unknown[] = []) {
  if (!currentTenantId()) throw new Error("Tenant transaction context is required");
  return client.query<T>(sql, params);
}
