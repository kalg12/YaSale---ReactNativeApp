import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEYS = {
  AUTH_TOKEN: "@yasale:auth_token",
  AUTH_USER: "@yasale:auth_user",
  STORE_ID: "@yasale:store_id",
  TENANT_ID: "@yasale:tenant_id",
  LANGUAGE: "@yasale:language",
};

export const storage = {
  async getAuthToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async setAuthToken(token: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  },

  async clearAuthToken(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  },

  async getUser(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.AUTH_USER);
  },

  async setUser(userJson: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_USER, userJson);
  },

  async clearUser(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },

  async getStoreId(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.STORE_ID);
  },

  async setStoreId(storeId: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.STORE_ID, storeId);
  },

  async clearStoreId(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.STORE_ID);
  },

  async getTenantId(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.TENANT_ID);
  },

  async setTenantId(tenantId: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.TENANT_ID, tenantId);
  },

  async clearTenantId(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.TENANT_ID);
  },

  async getLanguage(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
  },

  async setLanguage(lang: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  async clearAll(): Promise<void> {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  },
};
