/**
 * Query keys factory pattern for TanStack Query
 * Ensures consistent and hierarchical query key structure
 */

export const queryKeys = {
  all: () => ["yasale"],

  // Auth queries
  auth: () => [...queryKeys.all(), "auth"],
  me: () => [...queryKeys.auth(), "me"],

  // Menu queries
  menu: () => [...queryKeys.all(), "menu"],
  menuCategories: () => [...queryKeys.menu(), "categories"],
  menuProducts: () => [...queryKeys.menu(), "products"],
  menuProductDetail: (id: string) => [...queryKeys.menuProducts(), id],

  // Orders queries
  orders: () => [...queryKeys.all(), "orders"],
  ordersList: (storeId: string, filters?: Record<string, unknown>) => [
    ...queryKeys.orders(),
    "list",
    storeId,
    filters,
  ],
  orderDetail: (orderId: string) => [...queryKeys.orders(), "detail", orderId],

  // Checks queries
  checks: () => [...queryKeys.all(), "checks"],
  checksList: (storeId: string, filters?: Record<string, unknown>) => [
    ...queryKeys.checks(),
    "list",
    storeId,
    filters,
  ],
  checkDetail: (checkId: string) => [...queryKeys.checks(), "detail", checkId],

  // Reports queries
  reports: () => [...queryKeys.all(), "reports"],
  salesReport: (storeId: string, period?: string) => [
    ...queryKeys.reports(),
    "sales",
    storeId,
    period,
  ],
  statsReport: (storeId: string) => [...queryKeys.reports(), "stats", storeId],
};
