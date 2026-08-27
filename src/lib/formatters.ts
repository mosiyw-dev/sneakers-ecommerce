import { CurrencyCode } from "@/types";

export const CURRENCIES: Record<
  CurrencyCode,
  { symbol: string; name: string; rate: number; decimals: number; symbolPosition: "prefix" | "suffix" }
> = {
  TMN: { symbol: "تومان", name: "تومان (TMN)", rate: 1.0, decimals: 0, symbolPosition: "suffix" },
  USD: { symbol: "$", name: "دلار ($)", rate: 0.000011, decimals: 0, symbolPosition: "prefix" },
  AED: { symbol: "درهم", name: "درهم (AED)", rate: 0.000041, decimals: 0, symbolPosition: "suffix" },
};

/**
 * Convert number to Persian digits string (optional) or formatted number with separators
 */
export function formatCurrency(
  amountInTMN: number,
  currencyCode: CurrencyCode = "TMN"
): string {
  const currency = CURRENCIES[currencyCode] || CURRENCIES.TMN;
  const converted = amountInTMN * currency.rate;

  const formattedNum = new Intl.NumberFormat("fa-IR", {
    minimumFractionDigits: currency.decimals,
    maximumFractionDigits: currency.decimals,
  }).format(converted);

  if (currency.symbolPosition === "suffix") {
    return `${formattedNum} ${currency.symbol}`;
  }
  return `${currency.symbol}${formattedNum}`;
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(price: number, compareAtPrice?: number): number {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

/**
 * Generate a Persian/English realistic Order Reference ID
 */
export function generateOrderNumber(): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `JRD-${randomNum}`;
}

/**
 * Generate a realistic tracking number for post/courier
 */
export function generateTrackingNumber(): string {
  const seg1 = Math.floor(100000 + Math.random() * 900000);
  const seg2 = Math.floor(1000 + Math.random() * 9000);
  return `TPX-${seg1}-${seg2}`;
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
