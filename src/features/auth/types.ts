/**
 * Auth types
 */

export type UserRole = "ADMIN" | "MANAGER" | "KITCHEN" | "WAITER" | "CASHIER";

export interface Store {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  tenantId: string;
  stores: Store[];
}
