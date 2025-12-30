/**
 * UI Store - Zustand store for UI state (modals, loading, etc.)
 */

import { create } from "zustand";

interface UIState {
  // Connection state
  isOnline: boolean;
  setOnline: (isOnline: boolean) => void;

  // Loading states
  isSubmitting: boolean;
  setSubmitting: (isSubmitting: boolean) => void;

  // Snackbar / Toast
  snackbarMessage: string | null;
  snackbarType: "success" | "error" | "info" | "warning";
  showSnackbar: (
    message: string,
    type?: "success" | "error" | "info" | "warning"
  ) => void;
  hideSnackbar: () => void;

  // Kitchen view preference
  kitchenViewMode: "list" | "grid";
  setKitchenViewMode: (mode: "list" | "grid") => void;

  // Selected order (for detail view)
  selectedOrderId: string | null;
  setSelectedOrderId: (orderId: string | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isOnline: true,
  setOnline: (isOnline: boolean) => set({ isOnline }),

  isSubmitting: false,
  setSubmitting: (isSubmitting: boolean) => set({ isSubmitting }),

  snackbarMessage: null,
  snackbarType: "info",
  showSnackbar: (message: string, type = "info") =>
    set({ snackbarMessage: message, snackbarType: type }),
  hideSnackbar: () => set({ snackbarMessage: null }),

  kitchenViewMode: "grid",
  setKitchenViewMode: (mode: "list" | "grid") => set({ kitchenViewMode: mode }),

  selectedOrderId: null,
  setSelectedOrderId: (orderId: string | null) =>
    set({ selectedOrderId: orderId }),
}));
