import type { Pool } from "pg";
export async function pingDatabase(pool:Pool){await pool.query("SELECT 1");return true;}
