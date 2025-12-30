import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient } from "@tanstack/react-query";

/**
 * Simple query persistence for AsyncStorage
 * Note: Full persistence requires @tanstack/react-query-persist-client
 * which is not available. This provides basic functionality.
 */
export const createAsyncStoragePersister = () => ({
  persistClient: async (client: any) => {
    try {
      await AsyncStorage.setItem(
        "@tanstack/react-query-client",
        JSON.stringify(client)
      );
    } catch (error) {
      console.error("Failed to persist query client:", error);
    }
  },

  restoreClient: async () => {
    try {
      const data = await AsyncStorage.getItem("@tanstack/react-query-client");
      return data ? JSON.parse(data) : undefined;
    } catch (error) {
      console.error("Failed to restore query client:", error);
      return undefined;
    }
  },

  removeClient: async () => {
    try {
      await AsyncStorage.removeItem("@tanstack/react-query-client");
    } catch (error) {
      console.error("Failed to remove persisted query client:", error);
    }
  },
});

/**
 * Filter function to persist only menu queries
 * Orders, checks, and user data should NOT be persisted
 */
export const shouldDehydrateQuery = (
  query: ReturnType<typeof QueryClient.prototype.getQueryData> & any
): boolean => {
  const queryKey = query.queryKey;

  // Persist only menu queries
  if (Array.isArray(queryKey) && queryKey[0] === "yasale") {
    if (queryKey[1] === "menu") {
      return true;
    }
  }

  return false;
};
