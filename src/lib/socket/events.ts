/**
 * Socket.IO event definitions and type contracts
 */

export enum SocketEvent {
  // Order events
  ORDER_CREATED = "order.created",
  ORDER_STARTED = "order.started",
  ORDER_READY = "order.ready",
  ORDER_CANCELLED = "order.cancelled",

  // Check/Payment events
  CHECK_PAID = "check.paid",
  CHECK_CANCELLED = "check.cancelled",

  // Connection events
  CONNECT = "connect",
  DISCONNECT = "disconnect",
  RECONNECT = "reconnect",
}

// Type definitions for socket payloads
export interface OrderCreatedPayload {
  tenantId: string;
  storeId: string;
  order: {
    id: string;
    number: string;
    type: "DINE_IN" | "TO_GO";
    tableNumber?: string;
    customerName?: string;
    status: "PENDING" | "IN_PROGRESS" | "READY";
    items: {
      id: string;
      name: string;
      quantity: number;
      unitPrice: number;
      selectedVariants: { id: string; name: string; optionId: string }[];
      modifiers: {
        id: string;
        type: "ADD" | "REMOVE";
        name: string;
        price: number;
      }[];
      notes?: string;
    }[];
    subtotal: number;
    tax: number;
    total: number;
    notes?: string;
    createdAt: string;
  };
}

export interface OrderStatusPayload {
  tenantId: string;
  storeId: string;
  orderId: string;
  status: "PENDING" | "IN_PROGRESS" | "READY";
  updatedAt: string;
}

export interface CheckPaidPayload {
  tenantId: string;
  storeId: string;
  checkId: string;
  orderId: string;
  paidAt: string;
}

export interface OrderCancelledPayload {
  tenantId: string;
  storeId: string;
  orderId: string;
  cancelledAt: string;
  reason?: string;
}
