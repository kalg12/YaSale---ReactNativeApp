import Constants from "expo-constants";

interface AppConfig {
  API_URL: string;
  SOCKET_URL: string;
  DEFAULT_LANGUAGE: "es" | "en";
}

const getConfig = (): AppConfig => {
  const extra = Constants.expoConfig?.extra ?? {};

  return {
    API_URL: (extra.API_URL as string) || "http://localhost:3000/api",
    SOCKET_URL: (extra.SOCKET_URL as string) || "http://localhost:3000",
    DEFAULT_LANGUAGE: (extra.DEFAULT_LANGUAGE as "es" | "en") || "es",
  };
};

export const config = getConfig();
