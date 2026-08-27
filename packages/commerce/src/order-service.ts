import type { Order } from "./types";
import { transitionOrderStatus } from "./order-state-machine";

export interface OrderRepository { get(tenantId:string,id:string):Promise<Order|null>; create(input:{tenantId:string;customerId:string;items:{productId:string;quantity:number}[]}):Promise<Order>; updateStatus(tenantId:string,id:string,status:Order["status"]):Promise<Order>; }

export function createOrderService(repo: OrderRepository) {
  return {
    get: repo.get,
    create: repo.create,
    async update(tenantId:string,id:string,patch:Pick<Order,"status">) {
      const current=await repo.get(tenantId,id);
      if(!current) throw new Error("Order not found");
      const status=transitionOrderStatus(current.status,patch.status);
      return repo.updateStatus(tenantId,id,status);
    }
  };
}
