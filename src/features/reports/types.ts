/**
 * Reports types
 */

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
