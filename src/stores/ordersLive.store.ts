/**
 * Orders Live Store - Zustand store for real-time order state
 * This is fed by Socket.IO events and never persisted
 */

import { create } from "zustand";

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  selectedVariants: {
    id: string;
    name: string;
    optionId: string;
  }[];
  modifiers: {
    id: string;
    type: "ADD" | "REMOVE";
    name: string;
    price: number;
  }[];
  notes?: string;
}

export interface LiveOrder {
  id: string;
  number: string;
  type: "DINE_IN" | "TO_GO";
  tableNumber?: string;
  customerName?: string;
  status: "PENDING" | "IN_PROGRESS" | "READY";
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrdersLiveState {
  ordersById: Map<string, LiveOrder>;
  ordersList: LiveOrder[];

  // Actions
  upsertOrder: (order: LiveOrder) => void;
  updateOrderStatus: (
    orderId: string,
    status: "PENDING" | "IN_PROGRESS" | "READY"
  ) => void;
  removeOrder: (orderId: string) => void;
  clearAll: () => void;

  // Getters
  getOrder: (orderId: string) => LiveOrder | undefined;
  getOrdersByStatus: (
    status: "PENDING" | "IN_PROGRESS" | "READY"
  ) => LiveOrder[];
  getPendingOrdersCount: () => number;
  getReadyOrdersCount: () => number;
}

export const useOrdersLiveStore = create<OrdersLiveState>((set, get) => ({
  ordersById: new Map(),
  ordersList: [],

  upsertOrder: (order: LiveOrder) => {
    set((state) => {
      const newOrdersById = new Map(state.ordersById);
      newOrdersById.set(order.id, order);

      const newList = Array.from(newOrdersById.values()).sort((a, b) => {
        // Sort by status (READY last), then by created date (newest first)
        if (a.status !== b.status) {
          const statusOrder = { PENDING: 0, IN_PROGRESS: 1, READY: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      return {
        ordersById: newOrdersById,
        ordersList: newList,
      };
    });
  },

  updateOrderStatus: (
    orderId: string,
    status: "PENDING" | "IN_PROGRESS" | "READY"
  ) => {
    set((state) => {
      const order = state.ordersById.get(orderId);
      if (!order) return state;

      const updatedOrder = {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
      };

      const newOrdersById = new Map(state.ordersById);
      newOrdersById.set(orderId, updatedOrder);

      const newList = Array.from(newOrdersById.values()).sort((a, b) => {
        if (a.status !== b.status) {
          const statusOrder = { PENDING: 0, IN_PROGRESS: 1, READY: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      return {
        ordersById: newOrdersById,
        ordersList: newList,
      };
    });
  },

  removeOrder: (orderId: string) => {
    set((state) => {
      const newOrdersById = new Map(state.ordersById);
      newOrdersById.delete(orderId);
      const newList = Array.from(newOrdersById.values()).sort((a, b) => {
        if (a.status !== b.status) {
          const statusOrder = { PENDING: 0, IN_PROGRESS: 1, READY: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        }
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      return {
        ordersById: newOrdersById,
        ordersList: newList,
      };
    });
  },

  clearAll: () => {
    set({
      ordersById: new Map(),
      ordersList: [],
    });
  },

  getOrder: (orderId: string) => {
    return get().ordersById.get(orderId);
  },

  getOrdersByStatus: (status: "PENDING" | "IN_PROGRESS" | "READY") => {
    return get().ordersList.filter((order) => order.status === status);
  },

  getPendingOrdersCount: () => {
    return get().ordersList.filter((order) => order.status === "PENDING")
      .length;
  },

  getReadyOrdersCount: () => {
    return get().ordersList.filter((order) => order.status === "READY").length;
  },
}));
