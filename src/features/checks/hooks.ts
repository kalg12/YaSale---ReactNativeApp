/**
 * Checks hooks - React Query hooks for checks
 */

import { useQuery, useMutation } from "@tanstack/react-query";
import { getOpenChecks, closeCheck, CloseCheckPayload } from "./api";
import { queryKeys } from "../../lib/query/keys";
import { useUIStore } from "../../stores/ui.store";

/**
 * Hook to fetch open checks
 */
export const useOpenChecks = (storeId: string) => {
  return useQuery({
    queryKey: queryKeys.checksList(storeId, { status: "OPEN" }),
    queryFn: () => getOpenChecks(storeId),
    enabled: !!storeId,
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};

/**
 * Hook for closing check (payment)
 */
export const useCloseCheckMutation = () => {
  const showSnackbar = useUIStore((state) => state.showSnackbar);

  return useMutation({
    mutationFn: ({
      checkId,
      payload,
    }: {
      checkId: string;
      payload: CloseCheckPayload;
    }) => closeCheck(checkId, payload),
    onSuccess: () => {
      showSnackbar("Cuenta cerrada exitosamente", "success");
    },
    onError: (error) => {
      showSnackbar("Error al cerrar la cuenta", "error");
      console.error("Close check error:", error);
    },
  });
};
