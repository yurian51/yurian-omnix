import type { Order } from "./types";

const transitions: Record<Order["status"], readonly Order["status"][]> = {
  DRAFT: ["PENDING", "CANCELLED"],
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["FULFILLED", "CANCELLED"],
  FULFILLED: [],
  CANCELLED: []
};

export function canTransitionOrder(from: Order["status"], to: Order["status"]) { return transitions[from].includes(to); }
export function transitionOrderStatus(from: Order["status"], to: Order["status"]) { if (!canTransitionOrder(from,to)) throw new Error(`Invalid order transition: ${from} -> ${to}`); return to; }
export function allowedOrderTransitions(status: Order["status"]) { return [...transitions[status]]; }
