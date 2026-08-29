import type { PoolClient } from "pg";
const MIGRATION_LOCK_KEY = 91427361;
export async function acquireMigrationLock(client:PoolClient){await client.query("SELECT pg_advisory_lock($1)",[MIGRATION_LOCK_KEY]);}
export async function releaseMigrationLock(client:PoolClient){await client.query("SELECT pg_advisory_unlock($1)",[MIGRATION_LOCK_KEY]);}
