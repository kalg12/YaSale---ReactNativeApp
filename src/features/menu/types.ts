/**
 * Menu types
 */

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
