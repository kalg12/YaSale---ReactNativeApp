/**
 * Orders Socket - Initialize socket listeners for orders
 */

import { Socket } from "socket.io-client";
import { useOrdersLiveStore } from "../../stores/ordersLive.store";
import {
  SocketEvent,
  OrderCreatedPayload,
  OrderStatusPayload,
  CheckPaidPayload,
  OrderCancelledPayload,
} from "../../lib/socket/events";

/**
 * Initialize orders socket listeners
 * This should be called after socket connection is established
 */
export const initOrdersSocket = (socket: Socket, storeId: string): void => {
  const { upsertOrder, updateOrderStatus, removeOrder } =
    useOrdersLiveStore.getState();

  // Order created
  socket.on(SocketEvent.ORDER_CREATED, (payload: OrderCreatedPayload) => {
    if (payload.storeId === storeId) {
      upsertOrder(payload.order as any);
    }
  });

  // Order status updated
  socket.on(SocketEvent.ORDER_STARTED, (payload: OrderStatusPayload) => {
    if (payload.storeId === storeId) {
      updateOrderStatus(payload.orderId, "IN_PROGRESS");
    }
  });

  socket.on(SocketEvent.ORDER_READY, (payload: OrderStatusPayload) => {
    if (payload.storeId === storeId) {
      updateOrderStatus(payload.orderId, "READY");
    }
  });

  // Check paid - remove order
  socket.on(SocketEvent.CHECK_PAID, (payload: CheckPaidPayload) => {
    if (payload.storeId === storeId) {
      removeOrder(payload.orderId);
    }
  });

  // Order cancelled
  socket.on(SocketEvent.ORDER_CANCELLED, (payload: OrderCancelledPayload) => {
    if (payload.storeId === storeId) {
      removeOrder(payload.orderId);
    }
  });
};

/**
 * Cleanup socket listeners
 */
export const cleanupOrdersSocket = (socket: Socket): void => {
  socket.off(SocketEvent.ORDER_CREATED);
  socket.off(SocketEvent.ORDER_STARTED);
  socket.off(SocketEvent.ORDER_READY);
  socket.off(SocketEvent.CHECK_PAID);
  socket.off(SocketEvent.ORDER_CANCELLED);
};
