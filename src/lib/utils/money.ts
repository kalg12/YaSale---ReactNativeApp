/**
 * Format amount to currency (COP - Colombian Pesos default)
 */
export const formatCurrency = (
  amount: number,
  currency: string = "COP"
): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
};

/**
 * Parse currency string to number
 */
export const parseCurrency = (value: string): number => {
  const cleaned = value.replace(/[^\d]/g, "");
  return parseInt(cleaned, 10) || 0;
};

/**
 * Calculate percentage of amount
 */
export const calculatePercentage = (
  amount: number,
  percentage: number
): number => {
  return Math.round((amount * percentage) / 100);
};

/**
 * Add tax to amount
 */
export const addTax = (amount: number, taxPercentage: number): number => {
  return Math.round(amount + calculatePercentage(amount, taxPercentage));
};

/**
 * Calculate tip amount
 */
export const calculateTip = (
  subtotal: number,
  tipPercentage: number
): number => {
  return calculatePercentage(subtotal, tipPercentage);
};

/**
 * Format price for display (no currency symbol, just number)
 */
export const formatPrice = (amount: number): string => {
  return amount.toLocaleString("es-CO");
};
