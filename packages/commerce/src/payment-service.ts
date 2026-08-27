import type { Payment } from "./types";
import { transitionPaymentStatus } from "./payment-state-machine";

export interface PaymentRepository { get(tenantId:string,id:string):Promise<Payment|null>; getByOrder(tenantId:string,orderId:string):Promise<Payment|null>; updateStatus(tenantId:string,id:string,status:Payment["status"]):Promise<Payment>; }
export function createPaymentService(repo: PaymentRepository) { return { get:repo.get, getByOrder:repo.getByOrder, async updateStatus(tenantId:string,id:string,status:Payment["status"]) { const current=await repo.get(tenantId,id); if(!current) throw new Error("Payment not found"); return repo.updateStatus(tenantId,id,transitionPaymentStatus(current.status,status)); } }; }
