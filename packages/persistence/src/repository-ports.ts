import type { TenantScope } from "./tenant-scope";

export interface CustomerRepository<T> { get(scope: TenantScope, id: string): Promise<T | null>; findByPhone(scope: TenantScope, phone: string): Promise<T | null>; save(scope: TenantScope, customer: T): Promise<T>; }
export interface ConversationRepository<T> { get(scope: TenantScope, id: string): Promise<T | null>; findOpenByCustomer(scope: TenantScope, customerId: string): Promise<T | null>; save(scope: TenantScope, conversation: T): Promise<T>; }
export interface MessageRepository<T> { get(scope: TenantScope, id: string): Promise<T | null>; findByProviderId(scope: TenantScope, providerMessageId: string): Promise<T | null>; save(scope: TenantScope, message: T): Promise<T>; updateStatus(scope: TenantScope, id: string, status: string): Promise<void>; }
export interface OrderRepository<T> { get(scope: TenantScope, id: string): Promise<T | null>; save(scope: TenantScope, order: T): Promise<T>; }
export interface PaymentRepository<T> { get(scope: TenantScope, id: string): Promise<T | null>; findByOrder(scope: TenantScope, orderId: string): Promise<T | null>; }
export interface TicketRepository<T> { get(scope: TenantScope, id: string): Promise<T | null>; save(scope: TenantScope, ticket: T): Promise<T>; }
