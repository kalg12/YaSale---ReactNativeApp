/**
 * Checks API
 */

import { apiClient } from "../../lib/api/client";

export interface CheckItem {
  orderId: string;
  orderNumber: string;
  total: number;
}

export interface Check {
  id: string;
  tableNumber?: string;
  customerName?: string;
  items: CheckItem[];
  subtotal: number;
  tax: number;
  tip: number;
  total: number;
  status: "OPEN" | "PAID" | "CLOSED";
  createdAt: string;
  paidAt?: string;
  storeId: string;
}

export interface CloseCheckPayload {
  tip?: number;
  paymentMethod: "CASH" | "CARD";
}

export interface CloseCheckResponse {
  id: string;
  total: number;
  paidAt: string;
}

/**
 * Get open checks for store
 */
export const getOpenChecks = async (storeId: string): Promise<Check[]> => {
  const response = await apiClient.get<Check[]>(
    `/stores/${storeId}/checks?status=OPEN`
  );
  return response.data;
};

/**
 * Get check details
 */
export const getCheckDetail = async (checkId: string): Promise<Check> => {
  const response = await apiClient.get<Check>(`/checks/${checkId}`);
  return response.data;
};

/**
 * Close check (process payment)
 */
export const closeCheck = async (
  checkId: string,
  payload: CloseCheckPayload
): Promise<CloseCheckResponse> => {
  const response = await apiClient.post<CloseCheckResponse>(
    `/checks/${checkId}/close`,
    payload
  );
  return response.data;
};
