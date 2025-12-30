/**
 * Reports API
 */

import { apiClient } from "../../lib/api/client";

export interface SalesReport {
  date: string;
  totalSales: number;
  totalOrders: number;
  averageCheck: number;
  cashPayments: number;
  cardPayments: number;
}

export interface StatsReport {
  totalRevenueToday: number;
  totalOrdersToday: number;
  totalCustomersToday: number;
  averageCheckToday: number;
  topProducts: {
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

/**
 * Get sales report
 */
export const getSalesReport = async (
  storeId: string,
  period: "today" | "week" | "month"
): Promise<SalesReport[]> => {
  const response = await apiClient.get<SalesReport[]>(
    `/stores/${storeId}/reports/sales?period=${period}`
  );
  return response.data;
};

/**
 * Get stats report
 */
export const getStatsReport = async (storeId: string): Promise<StatsReport> => {
  const response = await apiClient.get<StatsReport>(
    `/stores/${storeId}/reports/stats`
  );
  return response.data;
};
