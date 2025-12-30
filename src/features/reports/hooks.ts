/**
 * Reports hooks
 */

import { useQuery } from "@tanstack/react-query";
import { getSalesReport, getStatsReport } from "./api";
import { queryKeys } from "../../lib/query/keys";

/**
 * Hook to fetch sales report
 */
export const useSalesReport = (
  storeId: string,
  period: "today" | "week" | "month" = "today"
) => {
  return useQuery({
    queryKey: queryKeys.salesReport(storeId, period),
    queryFn: () => getSalesReport(storeId, period),
    enabled: !!storeId,
  });
};

/**
 * Hook to fetch stats report
 */
export const useStatsReport = (storeId: string) => {
  return useQuery({
    queryKey: queryKeys.statsReport(storeId),
    queryFn: () => getStatsReport(storeId),
    enabled: !!storeId,
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
  });
};
