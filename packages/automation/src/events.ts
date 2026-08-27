export const AutomationEvents = {
  MESSAGE_RECEIVED: "message.received",
  CUSTOMER_CREATED: "customer.created",
  CUSTOMER_UPDATED: "customer.updated",
  ORDER_CREATED: "order.created",
  ORDER_UPDATED: "order.updated",
  ORDER_CANCELLED: "order.cancelled",
  PAYMENT_CREATED: "payment.created",
  PAYMENT_COMPLETED: "payment.completed",
  PAYMENT_FAILED: "payment.failed",
  TICKET_CREATED: "ticket.created",
  TICKET_ASSIGNED: "ticket.assigned",
  TICKET_CLOSED: "ticket.closed",
  GROUP_MEMBER_JOINED: "group.member.joined",
  GROUP_MEMBER_REMOVED: "group.member.removed",
} as const;

export type AutomationEventType = typeof AutomationEvents[keyof typeof AutomationEvents];
