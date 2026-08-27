import type { Pool } from "pg";
import { checkReadiness } from "./readiness";

export function createDatabaseHealthChecks(pool: Pool) {
  return {
    liveness: async () => { await pool.query("SELECT 1"); },
    readiness: async () => { await pool.query("SELECT 1"); }
  };
}

export async function databaseReadiness(pool: Pool) { return checkReadiness({ postgres: async () => { await pool.query("SELECT 1"); } }); }
