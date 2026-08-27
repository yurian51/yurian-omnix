import type { Customer, CustomerNote, CustomerTag, CustomerTimelineEvent } from "./types";

export interface CustomerService {
  get(tenantId: string, id: string): Promise<Customer | null>;
  findByPhone(tenantId: string, phone: string): Promise<Customer | null>;
  create(input: Pick<Customer, "tenantId" | "name" | "phone" | "email">): Promise<Customer>;
  update(tenantId: string, id: string, patch: Partial<Pick<Customer, "name" | "phone" | "email" | "status">>): Promise<Customer>;
}
export interface CustomerTagService { add(tag: CustomerTag): Promise<CustomerTag>; remove(tenantId: string, customerId: string, tagId: string): Promise<void>; list(tenantId: string, customerId: string): Promise<CustomerTag[]>; }
export interface CustomerNoteService { create(note: CustomerNote): Promise<CustomerNote>; list(tenantId: string, customerId: string, limit?: number): Promise<CustomerNote[]>; }
export interface CustomerTimelineService { append(event: CustomerTimelineEvent): Promise<CustomerTimelineEvent>; list(tenantId: string, customerId: string, limit?: number): Promise<CustomerTimelineEvent[]>; }
