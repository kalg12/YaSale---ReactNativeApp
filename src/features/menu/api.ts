/**
 * Menu API
 */

import { apiClient } from "../../lib/api/client";

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  order: number;
}

export interface MenuVariantOption {
  id: string;
  name: string;
  price: number;
}

export interface MenuVariant {
  id: string;
  name: string;
  isRequired: boolean;
  options: MenuVariantOption[];
}

export interface MenuModifier {
  id: string;
  name: string;
  type: "ADD" | "REMOVE";
  price: number;
}

export interface MenuProduct {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  basePrice: number;
  sku?: string;
  variants: MenuVariant[];
  modifiers: MenuModifier[];
  available: boolean;
}

export interface MenuResponse {
  categories: MenuCategory[];
  products: MenuProduct[];
}

/**
 * Get menu
 */
export const getMenu = async (storeId: string): Promise<MenuResponse> => {
  const response = await apiClient.get<MenuResponse>(`/stores/${storeId}/menu`);
  return response.data;
};

/**
 * Get product details
 */
export const getProduct = async (productId: string): Promise<MenuProduct> => {
  const response = await apiClient.get<MenuProduct>(`/products/${productId}`);
  return response.data;
};
