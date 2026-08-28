import { readFile } from "node:fs/promises";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { Pool } from "pg";
import { withDbTransaction } from "./transaction";
export async function runMigrations(pool:Pool,dir=join(process.cwd(),"packages/db/src/migrations")){const files=(await readdir(dir)).filter(f=>f.endsWith(".sql")).sort();await pool.query("CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())");for(const file of files){const exists=await pool.query("SELECT 1 FROM schema_migrations WHERE version=$1",[file]);if(exists.rowCount)continue;const sql=await readFile(join(dir,file),"utf8");await withDbTransaction(pool,async client=>{await client.query(sql);await client.query("INSERT INTO schema_migrations(version) VALUES($1)",[file]);});}}
