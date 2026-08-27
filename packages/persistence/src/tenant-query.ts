import type { PoolClient, QueryResultRow } from "pg";
import { queryTenant } from "./postgres-client";

export async function tenantQuery<T extends QueryResultRow = QueryResultRow>(client: PoolClient, sql: string, params: unknown[] = []) {
  if (!/\btenant_id\b/.test(sql.toLowerCase())) throw new Error("Tenant-scoped SQL must include tenant_id");
  return queryTenant<T>(client, sql, params);
}
