import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";
import type { Pool } from "pg";
import { withDbTransaction } from "./transaction";
import { acquireMigrationLock, releaseMigrationLock } from "./migration-lock";
const checksum=(sql:string)=>createHash("sha256").update(sql).digest("hex");
export async function runMigrations(pool:Pool,dir=join(process.cwd(),"packages/db/src/migrations")){const files=(await readdir(dir)).filter(f=>f.endsWith(".sql")).sort();const lockClient=await pool.connect();try{await acquireMigrationLock(lockClient);await lockClient.query("CREATE TABLE IF NOT EXISTS schema_migrations (version text PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now(), checksum text)");for(const file of files){const sql=await readFile(join(dir,file),"utf8");const digest=checksum(sql);const existing=await lockClient.query("SELECT checksum FROM schema_migrations WHERE version=$1",[file]);if(existing.rowCount){if(existing.rows[0].checksum&&existing.rows[0].checksum!==digest)throw new Error(`Migration drift detected: ${file}`);continue;}await withDbTransaction(pool,async client=>{await client.query(sql);await client.query("INSERT INTO schema_migrations(version,checksum) VALUES($1,$2)",[file,digest]);});}}finally{await releaseMigrationLock(lockClient);lockClient.release();}}
