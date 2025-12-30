/**
 * Orders types
 */

export interface OrderProduct {
  id: string;
  name: string;
  sku?: string;
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

export type OrderStatus = "PENDING" | "IN_PROGRESS" | "READY" | "CANCELLED";
export type OrderType = "DINE_IN" | "TO_GO";

export interface Order {
  id: string;
  number: string;
  status: OrderStatus;
  type: OrderType;
  tableNumber?: string;
  customerName?: string;
  items: OrderProduct[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  tenantId: string;
  storeId: string;
}
