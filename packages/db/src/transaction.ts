import type { Pool, PoolClient } from "pg";
export async function withDbTransaction<T>(pool:Pool,work:(client:PoolClient)=>Promise<T>):Promise<T>{const client=await pool.connect();try{await client.query("BEGIN");const result=await work(client);await client.query("COMMIT");return result;}catch(error){try{await client.query("ROLLBACK");}catch{}throw error;}finally{client.release();}}
