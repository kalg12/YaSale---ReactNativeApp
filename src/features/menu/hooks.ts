/**
 * Menu hooks - React Query hooks for menu data
 */

import { useQuery } from "@tanstack/react-query";
import { getMenu, getProduct } from "./api";
import { queryKeys } from "../../lib/query/keys";

/**
 * Hook to fetch menu data (categories and products)
 */
export const useMenu = (storeId: string) => {
  return useQuery({
    queryKey: queryKeys.menu(),
    queryFn: () => getMenu(storeId),
    enabled: !!storeId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to fetch single product details
 */
export const useProduct = (productId: string, enabled = true) => {
  return useQuery({
    queryKey: queryKeys.menuProductDetail(productId),
    queryFn: () => getProduct(productId),
    enabled: !!productId && enabled,
  });
};
