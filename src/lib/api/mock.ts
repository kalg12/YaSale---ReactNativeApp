/**
 * Mock data for development/testing
 * Remove or disable in production
 */

export const MOCK_CREDENTIALS = {
  KITCHEN: {
    pin: "1234",
    token: "mock_kitchen_token_xyz123",
    user: {
      id: "user_kitchen_1",
      name: "Chef Juan",
      role: "KITCHEN" as const,
      tenantId: "tenant_1",
      stores: [
        { id: "store_1", name: "Tienda Principal" },
        { id: "store_2", name: "Tienda Sucursal" },
      ],
    },
  },
  WAITER: {
    pin: "5678",
    token: "mock_waiter_token_abc456",
    user: {
      id: "user_waiter_1",
      name: "Mesero Carlos",
      role: "WAITER" as const,
      tenantId: "tenant_1",
      stores: [{ id: "store_1", name: "Tienda Principal" }],
    },
  },
  ADMIN: {
    pin: "9999",
    token: "mock_admin_token_def789",
    user: {
      id: "user_admin_1",
      name: "Administrador",
      role: "ADMIN" as const,
      tenantId: "tenant_1",
      stores: [
        { id: "store_1", name: "Tienda Principal" },
        { id: "store_2", name: "Tienda Sucursal" },
      ],
    },
  },
};

/**
 * Simulated delay for API calls
 */
export const simulateDelay = (ms: number = 500): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Check if a PIN matches mock credentials
 */
export const validateMockPin = (pin: string) => {
  for (const [role, creds] of Object.entries(MOCK_CREDENTIALS)) {
    if (creds.pin === pin) {
      return { found: true, role, credentials: creds };
    }
  }
  return { found: false, role: null, credentials: null };
};
