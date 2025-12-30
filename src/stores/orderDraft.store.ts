/**
 * Order Draft Store - Zustand store for draft order being created
 */

import { create } from "zustand";

export interface OrderDraftItem {
  id: string;
  productId: string;
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

interface OrderDraftState {
  items: OrderDraftItem[];
  orderType: "DINE_IN" | "TO_GO";
  tableNumber?: string;
  customerName?: string;
  notes?: string;
  tip?: number;
  paymentMethod?: "CASH" | "CARD";

  // Actions
  addItem: (item: OrderDraftItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<OrderDraftItem>) => void;
  setOrderType: (type: "DINE_IN" | "TO_GO") => void;
  setTableNumber: (tableNumber: string) => void;
  setCustomerName: (customerName: string) => void;
  setNotes: (notes: string) => void;
  setTip: (tip: number) => void;
  setPaymentMethod: (method: "CASH" | "CARD") => void;
  clear: () => void;

  // Getters
  getSubtotal: () => number;
  getTotal: () => number;
}

const initialState = {
  items: [],
  orderType: "DINE_IN" as const,
  tableNumber: undefined,
  customerName: undefined,
  notes: undefined,
  tip: undefined,
  paymentMethod: undefined,
};

export const useOrderDraftStore = create<OrderDraftState>((set, get) => ({
  ...initialState,

  addItem: (item: OrderDraftItem) => {
    set((state) => ({
      items: [...state.items, item],
    }));
  },

  removeItem: (itemId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
  },

  updateItem: (itemId: string, updates: Partial<OrderDraftItem>) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    }));
  },

  setOrderType: (type: "DINE_IN" | "TO_GO") => {
    set({ orderType: type });
  },

  setTableNumber: (tableNumber: string) => {
    set({ tableNumber });
  },

  setCustomerName: (customerName: string) => {
    set({ customerName });
  },

  setNotes: (notes: string) => {
    set({ notes });
  },

  setTip: (tip: number) => {
    set({ tip });
  },

  setPaymentMethod: (method: "CASH" | "CARD") => {
    set({ paymentMethod: method });
  },

  clear: () => {
    set(initialState);
  },

  getSubtotal: () => {
    const state = get();
    return state.items.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const modifiersTotal = item.modifiers.reduce(
        (modSum, mod) => modSum + mod.price,
        0
      );
      return sum + itemTotal + modifiersTotal * item.quantity;
    }, 0);
  },

  getTotal: () => {
    const state = get();
    const subtotal = state.getSubtotal();
    // Assuming 19% IVA (Colombian tax)
    const tax = Math.round(subtotal * 0.19);
    const tip = state.tip || 0;
    return subtotal + tax + tip;
  },
}));
