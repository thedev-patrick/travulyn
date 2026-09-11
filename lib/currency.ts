import { z } from "zod";

export const SUPPORTED_CURRENCIES = [
  { code: "USD", label: "US Dollar" },
  { code: "GBP", label: "British Pound" },
  { code: "EUR", label: "Euro" },
  { code: "NGN", label: "Nigerian Naira" },
  { code: "GHS", label: "Ghanaian Cedi" },
  { code: "KES", label: "Kenyan Shilling" },
  { code: "CAD", label: "Canadian Dollar" },
  { code: "ZAR", label: "South African Rand" },
] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number]["code"];

export const DEFAULT_CURRENCY: CurrencyCode = "USD";
export const CURRENCY_COOKIE = "currency";

export function isSupportedCurrency(value: string | undefined | null): value is CurrencyCode {
  return SUPPORTED_CURRENCIES.some((c) => c.code === value);
}

const ratesResponseSchema = z.object({
  result: z.literal("success"),
  base_code: z.literal("USD"),
  rates: z.record(z.string(), z.number()),
});

/**
 * USD-based exchange rates from a free, keyless FX API (open.er-api.com),
 * cached and revalidated hourly — rates only actually update ~daily, so this
 * stays fresh without hammering the endpoint.
 */
export async function getExchangeRates(): Promise<Record<string, number> | null> {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const parsed = ratesResponseSchema.safeParse(await res.json());
    return parsed.success ? parsed.data.rates : null;
  } catch {
    return null;
  }
}

/** Converts an amount between two currencies using USD-based rates as the pivot. */
export function convertAmount(
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>
): number | null {
  if (from === to) return amount;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) return null;
  return (amount / fromRate) * toRate;
}

export function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  }
}
