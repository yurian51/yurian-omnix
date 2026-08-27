export type ApiError = { code: string; message: string; requestId: string; details?: Record<string, unknown> };
export type ApiResponse<T> = { data: T; requestId: string } | { error: ApiError };
export type CreateOrderRequest = { customerId: string; items: { productId: string; quantity: number }[] };
export type UpdateOrderRequest = { status: "PENDING" | "CONFIRMED" | "FULFILLED" | "CANCELLED" };
export type CreateTicketRequest = { customerId: string; title: string; priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT" };
