import axios, { AxiosInstance, AxiosError, isAxiosError } from "axios";
import { config } from "../config/env";
import { useAuthStore } from "../../stores/auth.store";

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
  baseURL: config.API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  async (cfg) => {
    const token = useAuthStore.getState().token;
    if (token) {
      cfg.headers.Authorization = `Bearer ${token}`;
    }
    return cfg;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle 401 - unauthorized (token expired or invalid)
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

/**
 * Error helper to extract message from API response
 */
export const getErrorMessage = (error: unknown): string => {
  if (isAxiosError(error)) {
    return (
      (error.response?.data as any)?.message ||
      error.message ||
      "Error en la solicitud"
    );
  }
  return "Error desconocido";
};
