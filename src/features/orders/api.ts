/**
 * Orders API - Functions to call order endpoints
 */

import { apiClient } from "../../lib/api/client";
import { LiveOrder } from "../../stores/ordersLive.store";

export interface CreateOrderPayload {
  type: "DINE_IN" | "TO_GO";
  tableNumber?: string;
  customerName?: string;
  items: {
    productId: string;
    quantity: number;
    selectedVariants: {
      variantId: string;
      optionId: string;
    }[];
    modifiers: {
      modifierId: string;
      type: "ADD" | "REMOVE";
    }[];
    notes?: string;
  }[];
  notes?: string;
  storeId: string;
}

export interface CreateOrderResponse {
  id: string;
  number: string;
  createdAt: string;
}

export type OrderDetailResponse = LiveOrder;

export interface UpdateOrderStatusPayload {
  status: "PENDING" | "IN_PROGRESS" | "READY";
}

/**
 * Create new order
 */
export const createOrder = async (
  payload: CreateOrderPayload
): Promise<CreateOrderResponse> => {
  const response = await apiClient.post<CreateOrderResponse>(
    "/orders",
    payload
  );
  return response.data;
};

/**
 * Get order details
 */
export const getOrderDetail = async (
  orderId: string
): Promise<OrderDetailResponse> => {
  const response = await apiClient.get<OrderDetailResponse>(
    `/orders/${orderId}`
  );
  return response.data;
};

/**
 * Update order status (for kitchen)
 */
export const updateOrderStatus = async (
  orderId: string,
  payload: UpdateOrderStatusPayload
): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/status`, payload);
};

/**
 * Start order (atomic operation)
 */
export const startOrder = async (orderId: string): Promise<void> => {
  await apiClient.post(`/orders/${orderId}/start`, {});
};
