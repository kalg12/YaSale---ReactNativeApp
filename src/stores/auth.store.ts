/**
 * Auth Store - Zustand store for authentication state
 */

import { create } from "zustand";
import { storage } from "../lib/storage";

export enum UserRole {
  ADMIN = "ADMIN",
  MANAGER = "MANAGER",
  KITCHEN = "KITCHEN",
  WAITER = "WAITER",
  CASHIER = "CASHIER",
}

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

interface AuthState {
  token: string | null;
  user: User | null;
  tenantId: string | null;
  storeId: string | null;
  isLoading: boolean;

  setAuth: (token: string, user: User, storeId?: string) => Promise<void>;
  setStoreId: (storeId: string) => Promise<void>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  isAuthenticated: () => boolean;
  isKitchenUser: () => boolean;
  isWaiterUser: () => boolean;
  isAdminUser: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  tenantId: null,
  storeId: null,
  isLoading: true,

  setAuth: async (token: string, user: User, storeId?: string) => {
    const finalStoreId = storeId || user.stores[0]?.id;

    await Promise.all([
      storage.setAuthToken(token),
      storage.setUser(JSON.stringify(user)),
      storage.setTenantId(user.tenantId),
      finalStoreId ? storage.setStoreId(finalStoreId) : Promise.resolve(),
    ]);

    set({
      token,
      user,
      tenantId: user.tenantId,
      storeId: finalStoreId || null,
      isLoading: false,
    });
  },

  setStoreId: async (storeId: string) => {
    await storage.setStoreId(storeId);
    set({ storeId });
  },

  logout: async () => {
    await storage.clearAll();
    set({
      token: null,
      user: null,
      tenantId: null,
      storeId: null,
      isLoading: false,
    });
  },

  restoreSession: async () => {
    try {
      const [token, userJson, storeId] = await Promise.all([
        storage.getAuthToken(),
        storage.getUser(),
        storage.getStoreId(),
      ]);

      if (token && userJson) {
        const user = JSON.parse(userJson);
        set({
          token,
          user,
          tenantId: user.tenantId,
          storeId: storeId || user.stores[0]?.id || null,
        });
      }
    } catch (error) {
      console.error("Failed to restore session:", error);
      await get().logout();
    } finally {
      set({ isLoading: false });
    }
  },

  isAuthenticated: () => {
    const { token } = get();
    return !!token;
  },

  isKitchenUser: () => {
    const { user } = get();
    return user?.role === UserRole.KITCHEN;
  },

  isWaiterUser: () => {
    const { user } = get();
    return [UserRole.WAITER, UserRole.CASHIER].includes(user?.role as UserRole);
  },

  isAdminUser: () => {
    const { user } = get();
    return [UserRole.ADMIN, UserRole.MANAGER].includes(user?.role as UserRole);
  },
}));
