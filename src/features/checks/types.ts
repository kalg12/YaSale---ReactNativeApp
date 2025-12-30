/**
 * Checks types
 */

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
