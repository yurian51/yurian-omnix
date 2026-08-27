import type { Payment } from "./types";

const transitions: Record<Payment["status"], readonly Payment["status"][]> = { PENDING: ["PAID", "FAILED"], PAID: ["REFUNDED"], FAILED: ["PENDING"], REFUNDED: [] };
export function canTransitionPayment(from: Payment["status"], to: Payment["status"]) { return transitions[from].includes(to); }
export function transitionPaymentStatus(from: Payment["status"], to: Payment["status"]) { if (!canTransitionPayment(from,to)) throw new Error(`Invalid payment transition: ${from} -> ${to}`); return to; }
