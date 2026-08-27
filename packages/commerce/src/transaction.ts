export interface Transaction { commit():Promise<void>; rollback():Promise<void>; }
export interface TransactionRunner { run<T>(work:(tx:Transaction)=>Promise<T>):Promise<T>; }
export async function withTransaction<T>(runner:TransactionRunner,work:(tx:Transaction)=>Promise<T>){return runner.run(work);}
