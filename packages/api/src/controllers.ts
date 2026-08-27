import type { CustomerService } from "../../crm/src/services";
import type { OrderService, ProductService, PaymentService, TicketService } from "../../commerce/src/services";
import { requireItems, requirePositiveInteger, requireString } from "./validation";
import type { ControllerContext, ControllerResult } from "./controller-types";
import { mapApiError } from "./error-mapper";

export function createControllers(services: { customers: CustomerService; products: ProductService; orders: OrderService; payments: PaymentService; tickets: TicketService }) {
  const run = async <T>(ctx: ControllerContext, work:()=>Promise<T>):Promise<ControllerResult<T>> => { try { return { status:200, body:{ data:await work(), requestId:ctx.requestId } }; } catch(error) { const apiError=mapApiError(error,ctx.requestId); return { status: apiError.code === "NOT_FOUND" ? 404 : apiError.code === "FORBIDDEN" ? 403 : apiError.code === "VALIDATION_ERROR" ? 400 : 500, body:{ error:apiError } }; } };
  return {
    customerGet: (ctx:ControllerContext,id:unknown) => run(ctx,()=>services.customers.get(ctx.tenantId,requireString(id,"id"))),
    productSearch: (ctx:ControllerContext,query:unknown) => run(ctx,()=>services.products.search(ctx.tenantId,String(query??""))),
    orderGet: (ctx:ControllerContext,id:unknown) => run(ctx,()=>services.orders.get(ctx.tenantId,requireString(id,"id"))),
    orderCreate: (ctx:ControllerContext,body:unknown) => run(ctx,()=>{const b=body as any;const customerId=requireString(b?.customerId,"customerId");const items=requireItems(b?.items).map((i:any)=>({productId:requireString(i?.productId,"productId"),quantity:requirePositiveInteger(i?.quantity,"quantity")}));return services.orders.create({tenantId:ctx.tenantId,customerId,items});}),
    orderUpdate: (ctx:ControllerContext,id:unknown,body:unknown) => run(ctx,()=>services.orders.update(ctx.tenantId,requireString(id,"id"),{status:(body as any)?.status})),
    paymentGet: (ctx:ControllerContext,id:unknown) => run(ctx,()=>services.payments.get(ctx.tenantId,requireString(id,"id"))),
    ticketCreate: (ctx:ControllerContext,body:unknown) => run(ctx=>{throw new Error("unreachable")},async()=>null as never)
  };
}
