/**
 * Auth hooks - React Query mutations for authentication
 */

import { useMutation } from "@tanstack/react-query";
import { pinLogin, PinLoginPayload, AuthResponse } from "./api";
import { useAuthStore } from "../../stores/auth.store";
import { useRouter } from "expo-router";

/**
 * Hook for PIN login mutation
 */
export const usePinLoginMutation = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (payload: PinLoginPayload) => pinLogin(payload),
    onSuccess: async (data: AuthResponse, payload: PinLoginPayload) => {
      // Store auth and redirect
      // Cast user as any to bypass strict type checking for API response
      await setAuth(data.token, data.user as any, payload.storeId);

      // Redirect based on role
      const role = data.user.role;
      if (role === "KITCHEN") {
        router.replace("/kitchen" as any);
      } else if (["WAITER", "CASHIER"].includes(role)) {
        router.replace("/waiter" as any);
      } else if (["ADMIN", "MANAGER"].includes(role)) {
        router.replace("/admin" as any);
      }
    },
    onError: (error) => {
      console.error("Login error:", error);
      throw error;
    },
  });
};

/**
 * Hook to check and restore session on app start
 */
export const useSessionRestore = () => {
  const restoreSession = useAuthStore((state) => state.restoreSession);
  const isLoading = useAuthStore((state) => state.isLoading);

  return {
    isLoading,
    restoreSession,
  };
};
