/**
 * Orders hooks - React Query hooks for orders
 */

import { useMutation } from "@tanstack/react-query";
import {
  createOrder,
  updateOrderStatus,
  startOrder,
  CreateOrderPayload,
} from "./api";
import { useUIStore } from "../../stores/ui.store";
import { useOrderDraftStore } from "../../stores/orderDraft.store";

/**
 * Hook for creating order
 */
export const useCreateOrderMutation = () => {
  const showSnackbar = useUIStore((state) => state.showSnackbar);
  const clearDraft = useOrderDraftStore((state) => state.clear);

  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => createOrder(payload),
    onSuccess: () => {
      clearDraft();
      showSnackbar("Orden creada exitosamente", "success");
    },
    onError: (error) => {
      showSnackbar("Error al crear la orden", "error");
      console.error("Create order error:", error);
    },
  });
};

/**
 * Hook for updating order status
 */
export const useUpdateOrderStatusMutation = () => {
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: string;
      status: "PENDING" | "IN_PROGRESS" | "READY";
    }) => updateOrderStatus(orderId, { status }),
    onSuccess: () => {
      showSnackbar("Estado de la orden actualizado", "success");
    },
    onError: (error) => {
      showSnackbar("Error al actualizar la orden", "error");
      console.error("Update order status error:", error);
    },
  });
};

/**
 * Hook for starting order (kitchen)
 */
export const useStartOrderMutation = () => {
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  return useMutation({
    mutationFn: (orderId: string) => startOrder(orderId),
    onSuccess: () => {
      showSnackbar("Orden iniciada", "success");
    },
    onError: (error) => {
      showSnackbar("Error al iniciar la orden", "error");
      console.error("Start order error:", error);
    },
  });
};
