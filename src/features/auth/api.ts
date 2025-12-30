/**
 * Auth API - Functions to call authentication endpoints
 */

import { apiClient } from "../../lib/api/client";
import { simulateDelay, validateMockPin } from "../../lib/api/mock";

// Enable mock mode for development (set to false for production)
const USE_MOCK_AUTH = true;

export interface PinLoginPayload {
  pin: string;
  storeId?: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    role: "ADMIN" | "MANAGER" | "KITCHEN" | "WAITER" | "CASHIER";
    tenantId: string;
    stores: {
      id: string;
      name: string;
    }[];
  };
}

export interface MeResponse {
  id: string;
  name: string;
  role: "ADMIN" | "MANAGER" | "KITCHEN" | "WAITER" | "CASHIER";
  tenantId: string;
  stores: {
    id: string;
    name: string;
  }[];
}

/**
 * Login with PIN
 */
export const pinLogin = async (
  payload: PinLoginPayload
): Promise<AuthResponse> => {
  // Use mock auth for development
  if (USE_MOCK_AUTH) {
    await simulateDelay(500);

    const validation = validateMockPin(payload.pin);
    if (!validation.found) {
      throw new Error(
        "PIN incorrecto. Prueba: 1234 (Kitchen), 5678 (Waiter), 9999 (Admin)"
      );
    }

    const credentials = validation.credentials as any;
    return {
      token: credentials.token,
      user: credentials.user,
    };
  }

  // Real API call (when mock is disabled)
  const response = await apiClient.post<AuthResponse>(
    "/auth/pin-login",
    payload
  );
  return response.data;
};

/**
 * Get current user info
 */
export const getMe = async (): Promise<MeResponse> => {
  const response = await apiClient.get<MeResponse>("/auth/me");
  return response.data;
};

/**
 * Logout
 */
export const logout = async (): Promise<void> => {
  await apiClient.post("/auth/logout");
};
