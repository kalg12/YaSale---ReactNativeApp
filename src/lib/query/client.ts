import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry failed requests once
      retry: 1,
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Keep data in cache for 10 minutes before garbage collection
      gcTime: 10 * 60 * 1000,
      // Don't refetch on window focus (not applicable in RN, but good for web)
      refetchOnWindowFocus: false,
      // Don't refetch when component mounts if data is fresh
      refetchOnMount: false,
      // Don't refetch when network reconnects (will be handled by socket)
      refetchOnReconnect: false,
    },
    mutations: {
      // Retry mutations once
      retry: 1,
    },
  },
});
